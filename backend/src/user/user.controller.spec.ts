import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  AUTH_REQUEST_DEFAULT,
  POPULATE_CLIENT_PRIMARY_ID,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from '../constants';
import { FETCH_USER, GET_USER } from './user.constant';
import { EmailService } from '../email/email.service';
import { AuthRequest } from 'src/auth/auth.type';
import { ITEMS_PER_PAGE, SEED_ROLE_SALES_ID } from '@shared/constants';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PdfService } from 'src/pdf/pdf.service';
import { SheetService } from 'src/sheet/sheet.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        JwtService,
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(''),
          },
        },
        {
          provide: PdfService,
          useValue: {
            generatePdf: jest.fn(),
          },
        },
        {
          provide: SheetService,
          useValue: {
            generateSheet: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should create an user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userController.post(AUTH_REQUEST_DEFAULT, {
          email: 'jane.doe@email.com',
          fullName: 'Jane Doe',
          roleId: SEED_ROLE_SALES_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should find signed user', async () => {
    const user = await userController.getProfile(AUTH_REQUEST_DEFAULT);

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should not find inactive user', async () => {
    await expect(
      userController.get(AUTH_REQUEST_DEFAULT, {
        id: POPULATE_USER_INACTIVE.id,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not find signed inactive user', async () => {
    const request = {
      ...AUTH_REQUEST_DEFAULT,
      authToken: {
        ...AUTH_REQUEST_DEFAULT.authToken,
        userId: POPULATE_USER_INACTIVE.id,
      },
    } as AuthRequest;

    await expect(userController.getProfile(request)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should find one user by id', async () => {
    const request = {
      ...AUTH_REQUEST_DEFAULT,
      authToken: {
        ...AUTH_REQUEST_DEFAULT.authToken,
        userId: 1,
      },
    } as AuthRequest;

    const user = await userController.get(request, {
      id: POPULATE_USER_DEFAULT.id,
    });

    for (const key in GET_USER) {
      expect(user).toHaveProperty(key);
    }
  });

  it('should not allow find user by id equal to signed id', async () => {
    await expect(
      userController.get(AUTH_REQUEST_DEFAULT, {
        id: POPULATE_USER_DEFAULT.id,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should update user and return the same properties of get user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      const user = await userController.patch(
        request,
        { id: POPULATE_USER_DEFAULT.id },
        {
          fullName: 'Jane Doe',
        },
      );

      for (const key in GET_USER) {
        expect(user).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should not allow update user with id equal to signed id', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userController.patch(
          AUTH_REQUEST_DEFAULT,
          { id: POPULATE_USER_DEFAULT.id },
          {
            fullName: 'Jane Doe',
          },
        ),
      ).rejects.toThrow(ForbiddenException);

      transaction.rollback();
    });
  });

  it('should update signed user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userController.patchProfile(AUTH_REQUEST_DEFAULT, {
        fullName: 'Jane Doe',
      });

      for (const key in GET_USER) {
        expect(user).toHaveProperty(key);
      }

      transaction.rollback();
    });
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userController.findMany(AUTH_REQUEST_DEFAULT, {
      page: 1,
      status: 'active',
      fullName: POPULATE_USER_DEFAULT.fullName,
      orderBy: 'fullName',
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      where: {
        fullName: {
          contains: POPULATE_USER_DEFAULT.fullName.toLocaleLowerCase(),
          mode: 'insensitive',
        },
        isActive: true,
        clientId: POPULATE_CLIENT_PRIMARY_ID,
        NOT: {
          id: POPULATE_USER_DEFAULT.id,
        },
      },
      orderBy: [{ fullName: 'asc' }],
      select: FETCH_USER,
    });
  });

  it('should find many user and not return birthDate, because if it return the property should be formatted', async () => {
    const result = await userController.findMany(AUTH_REQUEST_DEFAULT, {
      page: 1,
    });

    expect(result.data[0]).not.toHaveProperty('birthDate');
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const request = {
        ...AUTH_REQUEST_DEFAULT,
        authToken: {
          ...AUTH_REQUEST_DEFAULT.authToken,
          userId: 1,
        },
      } as AuthRequest;

      expect(
        await userController.disable(
          request,
          { id: POPULATE_USER_DEFAULT.id },
          {
            isActive: false,
          },
        ),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not allow disable user by id with id equal to signed id ', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userController.disable(
          AUTH_REQUEST_DEFAULT,
          { id: POPULATE_USER_DEFAULT.id },
          {
            isActive: false,
          },
        ),
      ).rejects.toThrow(ForbiddenException);

      transaction.rollback();
    });
  });

  it('should get user permissions', async () => {
    const permissions =
      await userController.getPermissions(AUTH_REQUEST_DEFAULT);

    expect(permissions).toBeTruthy();
  });

  it('should generate pdf', async () => {
    const response = await userController.generatePdf(AUTH_REQUEST_DEFAULT, {
      status: 'active',
      fullName: POPULATE_USER_DEFAULT.fullName,
      orderBy: 'fullName',
    });

    expect(response).toBeUndefined();
  });

  it('should generate sheet', async () => {
    const response = await userController.generateSheet(AUTH_REQUEST_DEFAULT, {
      status: 'active',
      fullName: POPULATE_USER_DEFAULT.fullName,
      orderBy: 'fullName',
    });

    expect(response).toBeUndefined();
  });
});

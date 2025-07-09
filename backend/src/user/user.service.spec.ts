import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  POPULATE_CLIENT_PRIMARY_ID,
  POPULATE_CLIENT_SECONDARY_ID,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from '../constants';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import {
  ITEMS_PER_PAGE,
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '@shared/constants';
import { PdfService } from 'src/pdf/pdf.service';
import { SheetService } from 'src/sheet/sheet.service';
import { adddressNullableFields } from './user.constant';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        SheetService,
        PdfService,
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
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an user with minimal data', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spyEncryptPassword = jest.spyOn(userService, 'encryptPassword');
      const spyGenerateRandomPassword = jest.spyOn(
        userService,
        'generateRandomPassword',
      );

      expect(
        await userService.create({
          userCreateInDto: {
            email: 'jane.doe@email.com',
            fullName: 'Jane Doe',
            clientId: POPULATE_CLIENT_PRIMARY_ID,
            roleId: SEED_ROLE_SALES_ID,
          },
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should not create an user with the same email', async () => {
    await expect(
      userService.create({
        userCreateInDto: {
          email: POPULATE_USER_DEFAULT.email,
          fullName: 'John Doe',
          clientId: POPULATE_CLIENT_PRIMARY_ID,
          roleId: SEED_ROLE_SALES_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an user with an email of an inactive user', async () => {
    await expect(
      userService.create({
        userCreateInDto: {
          email: POPULATE_USER_INACTIVE.email,
          fullName: 'Tony Stark',
          clientId: POPULATE_CLIENT_PRIMARY_ID,
          roleId: SEED_ROLE_SALES_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should not create an user with an cpf of an inactive user', async () => {
    await expect(
      userService.create({
        userCreateInDto: {
          email: 'jane.doe@email.com',
          fullName: 'John Doe',
          cpf: POPULATE_USER_INACTIVE.cpf,
          clientId: POPULATE_CLIENT_PRIMARY_ID,
          roleId: SEED_ROLE_SALES_ID,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create an user with full data and minimal address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spyEncryptPassword = jest.spyOn(userService, 'encryptPassword');
      const spyGenerateRandomPassword = jest.spyOn(
        userService,
        'generateRandomPassword',
      );

      expect(
        await userService.create({
          userCreateInDto: {
            fullName: 'Jane Doe',
            email: 'jane.doe@email.com',
            cpf: '11111111111',
            birthDate: '2000-01-01',
            code: 'ABCDEF',
            cellPhone: '42988884444',
            address: {
              cep: '12345678',
              number: '123',
            },
            clientId: POPULATE_CLIENT_PRIMARY_ID,
            roleId: SEED_ROLE_SALES_ID,
          },
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should create an user with full data and full address', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spyEncryptPassword = jest.spyOn(userService, 'encryptPassword');
      const spyGenerateRandomPassword = jest.spyOn(
        userService,
        'generateRandomPassword',
      );

      expect(
        await userService.create({
          userCreateInDto: {
            fullName: 'Jane Doe',
            email: 'jane.doe@email.com',
            cpf: '11111111111',
            birthDate: '2000-01-01',
            code: 'ABCDEF',
            cellPhone: '42988884444',
            address: {
              cep: '12345678',
              number: '123',
              street: 'Broadway',
              city: 'New York',
              state: 'NY',
              neighborhood: 'Manhattan',
              complement: 'Apt 123',
            },
            clientId: POPULATE_CLIENT_PRIMARY_ID,
            roleId: SEED_ROLE_SALES_ID,
          },
        }),
      ).toBeTruthy();

      expect(spyEncryptPassword).toHaveBeenCalled();
      expect(spyGenerateRandomPassword).toHaveBeenCalled();

      transaction.rollback();
    });
  });

  it('should update user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            fullName: 'Jane Doe',
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not verify duplicated if cpf is not passed', async () => {
    const spy = jest.spyOn(userService, 'verifyDuplicated');

    await userService.update({
      where: {
        id: POPULATE_USER_DEFAULT.id,
      },
      userUpdateInDto: {
        code: '123',
      },
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update user cpf', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            cpf: '11111111111',
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not update user with cpf that already exist', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            cpf: POPULATE_USER_DEFAULT.cpf,
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should not update user with cpf of an inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            cpf: POPULATE_USER_INACTIVE.cpf,
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).rejects.toThrow(ConflictException);

      transaction.rollback();
    });
  });

  it('should update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spy = jest.spyOn(userService, 'encryptPassword');

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            password: '123456',
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).toBeTruthy();

      expect(spy).toHaveBeenCalledWith({ password: '123456' });

      transaction.rollback();
    });
  });

  it('should not update password of an inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const spy = jest.spyOn(userService, 'encryptPassword');

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_INACTIVE.id,
          },
          userUpdateInDto: {
            password: '123456',
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(spy).toHaveBeenCalledTimes(0);

      transaction.rollback();
    });
  });

  it('should not update user with outer client id provided', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            password: '123456',
          },
          clientId: POPULATE_CLIENT_SECONDARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should create user address and if already exist update setting all to null', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);
      const spy = jest.spyOn(transaction.user, 'update');

      const commomPayload = {
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
      };

      await userService.update({
        ...commomPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
        },
      });

      const user = await userService.update({
        ...commomPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '87654321', number: '321' },
          },
        },
      });

      expect(user).toHaveProperty('address.cep', '87654321');
      expect(user).toHaveProperty('address.number', '321');
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            address: {
              update: {
                ...adddressNullableFields,
                cep: '87654321',
                number: '321',
              },
            },
          },
        }),
      );

      transaction.rollback();
    });
  });

  it('should create user address and update role', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
          roleId: SEED_ROLE_SALES_ID,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
      });

      expect(user).toHaveProperty('address.cep', '12345678');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('roleId', SEED_ROLE_SALES_ID);

      transaction.rollback();
    });
  });

  it('should update user address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const commomPayload = {
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
      };

      await expect(
        userService.update({
          ...commomPayload,
          userUpdateInDto: {
            address: {
              update: { street: 'Broadway' },
            },
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await userService.update({
        ...commomPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
        },
      });

      const user = await userService.update({
        ...commomPayload,
        userUpdateInDto: {
          address: {
            update: { street: 'Broadway' },
          },
        },
      });

      expect(user).toHaveProperty('address.cep', '12345678');
      expect(user).toHaveProperty('address.number', '123');
      expect(user).toHaveProperty('address.street', 'Broadway');

      transaction.rollback();
    });
  });

  it('should delete user address and if not exist should throw an exception', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const commomPayload = {
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
      };

      await expect(
        userService.update({
          ...commomPayload,
          userUpdateInDto: {
            address: {
              remove: true,
            },
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await userService.update({
        ...commomPayload,
        userUpdateInDto: {
          address: {
            add: { cep: '12345678', number: '123' },
          },
        },
      });

      const user = await userService.update({
        ...commomPayload,
        userUpdateInDto: {
          address: {
            remove: true,
          },
        },
      });

      expect(user).toHaveProperty('address', null);

      transaction.rollback();
    });
  });

  it('should set jit to null when update user role', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          roleId: SEED_ROLE_ADMIN_ID,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
        select: {
          jit: true,
        },
      });

      expect(user).toHaveProperty('jit', null);

      transaction.rollback();
    });
  });

  it('should set jit to null when update user password', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          password: '123456',
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
        select: {
          jit: true,
        },
      });

      expect(user).toHaveProperty('jit', null);

      transaction.rollback();
    });
  });

  it('should set jit to null when update user active status', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const user = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          isActive: false,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
        select: {
          jit: true,
        },
      });

      expect(user).toHaveProperty('jit', null);

      transaction.rollback();
    });
  });

  it('should disable user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            isActive: false,
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not disable inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_INACTIVE.id,
          },
          userUpdateInDto: {
            isActive: false,
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should enable inactive user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      expect(
        await userService.update({
          where: {
            id: POPULATE_USER_INACTIVE.id,
          },
          userUpdateInDto: {
            isActive: true,
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).toBeTruthy();

      transaction.rollback();
    });
  });

  it('should not enable active user', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      await expect(
        userService.update({
          where: {
            id: POPULATE_USER_DEFAULT.id,
          },
          userUpdateInDto: {
            isActive: true,
          },
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        }),
      ).rejects.toThrow(NotFoundException);

      transaction.rollback();
    });
  });

  it('should update user with allowed null values', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const result = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          cpf: null,
          birthDate: null,
          cellPhone: null,
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          cpf: null,
          birthDate: null,
          cellPhone: null,
        }),
      );

      transaction.rollback();
    });
  });

  it('should update birthDate and return it formatted', async () => {
    await prismaService.transaction(async (transaction) => {
      Reflect.set(userService, 'prismaService', transaction);

      const result = await userService.update({
        where: {
          id: POPULATE_USER_DEFAULT.id,
        },
        userUpdateInDto: {
          birthDate: '2000-01-02',
        },
        clientId: POPULATE_CLIENT_PRIMARY_ID,
      });

      expect(result).toHaveProperty('birthDate', '2000-01-02');

      transaction.rollback();
    });
  });

  it('should find one user by id and return it with formatted birthDate', async () => {
    const user = await userService.findOne({
      where: { id: POPULATE_USER_DEFAULT.id },
      select: { id: true, birthDate: true },
    });

    expect(user).toHaveProperty('birthDate', '2000-01-01');
    expect(user).toHaveProperty('id');
  });

  it('should not find inactive user', async () => {
    await expect(
      userService.findOne({
        where: { id: POPULATE_USER_INACTIVE.id },
        select: { id: true },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find inactive user', async () => {
    const user = await userService.findOne({
      where: { id: POPULATE_USER_INACTIVE.id },
      select: { id: true },
      onlyActive: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not find user with outer client id provided', async () => {
    await expect(
      userService.findOne({
        where: { id: POPULATE_USER_DEFAULT.id },
        select: { id: true },
        clientId: POPULATE_CLIENT_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find many users with pagination', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { page: 1 },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(result).toHaveProperty('total', 24);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users without signed user', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { page: 1 },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    const signedUser = result.data.find(
      (item) => item.id === POPULATE_USER_DEFAULT.id,
    );

    expect(signedUser).toBeUndefined();
    expect(result).toHaveProperty('total', 24);
    expect(result.data).toHaveLength(ITEMS_PER_PAGE);
  });

  it('should find many users by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: {
        fullName: POPULATE_USER_DEFAULT.fullName,
      },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          fullName: {
            contains: POPULATE_USER_DEFAULT.fullName.toLocaleLowerCase(),
            mode: 'insensitive',
          },
        }) as object,
      }),
    );
  });

  it('should find many users ordered by full name', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: { orderBy: 'fullName' },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ fullName: 'asc' }] }),
    );
  });

  it('should find many users by status igual to inactive', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { status: 'inactive' },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(result).toHaveProperty('total', 7);
  });

  it('should find many users with many filters', async () => {
    const spy = jest.spyOn(prismaService.user, 'findMany');

    await userService.findMany({
      userFindManyInDto: {
        page: 1,
        status: 'active',
        fullName: POPULATE_USER_DEFAULT.fullName,
        orderBy: 'fullName',
      },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalledWith({
      skip: 0,
      take: ITEMS_PER_PAGE,
      select: undefined,
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
    });
  });

  it('should not find many users with outer client id provided', async () => {
    const result = await userService.findMany({
      userFindManyInDto: { status: 'active' },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_SECONDARY_ID,
    });

    expect(result).toHaveProperty('total', 0);
    expect(result).toHaveProperty('data', []);
  });

  it('should get user permissions', async () => {
    await expect(
      userService.getPermissions({
        userId: POPULATE_USER_DEFAULT.id,
        clientId: POPULATE_CLIENT_SECONDARY_ID,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not get user permissions with outer client id provided', async () => {
    const permissions = await userService.getPermissions({
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(permissions).toEqual({
      USERS: {
        CREATE: true,
        READ: true,
        UPDATE: true,
        DELETE: true,
      },
    });
  });

  it('should generate pdf', async () => {
    const spy = jest.spyOn(PdfService.prototype, 'generatePdf');

    await userService.generatePdf({
      userGeneratePdfInDto: {
        status: 'active',
      },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should generate sheet', async () => {
    const spy = jest.spyOn(SheetService.prototype, 'generateSheet');

    await userService.generateSheet({
      userGenerateSheetInDto: {
        status: 'active',
      },
      userId: POPULATE_USER_DEFAULT.id,
      clientId: POPULATE_CLIENT_PRIMARY_ID,
    });

    expect(spy).toHaveBeenCalled();
  });
});

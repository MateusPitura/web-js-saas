import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthResetPassword,
  AuthSignin,
  ForgetPasswordInput,
  RequestChangePasswordInput,
  ResetPasswordInput,
  SiginInInput,
  SignOutInput,
  SignUpInput,
} from './auth.type';
import { compare } from 'bcrypt';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../database/prisma.service';
import { SEED_ROLE_ADMIN_ID, JWT_COOKIE_NAME } from '@shared/constants';
import { FRONTEND_URL } from 'src/constants';
import { randomUUID } from 'crypto';
import handlePermissions from 'src/utils/handlePermissions';
import { Role } from 'src/user/user.type';
import { GET_PERMISSIONS } from 'src/user/user.constant';
import { isProduction } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clientService: ClientService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  async signIn({ authSignInInDto, res }: SiginInInput) {
    const user = await this.userService.findOne({
      where: { email: authSignInInDto.email },
      select: {
        ...GET_PERMISSIONS,
        id: true,
        clientId: true,
        password: true,
      },
      showNotFoundError: false,
    });

    if (!user || !(await compare(authSignInInDto.password, user.password))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const jit = randomUUID();

    await this.userService.update({
      where: { id: user.id },
      userUpdateInDto: { jit },
    });

    const permissions = handlePermissions({
      role: user?.role as Role,
    });

    const payload: AuthSignin = {
      clientId: user.clientId,
      userId: user.id,
      jit,
      permissions,
    };

    const token = this.jwtService.sign(payload);

    res?.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return res?.json(true);
  }

  async signOut({ userId, clientId, res }: SignOutInput) {
    await this.userService.update({
      where: { id: userId },
      userUpdateInDto: { jit: null },
      showNotFoundError: false,
      clientId,
    });

    res?.clearCookie(JWT_COOKIE_NAME);

    return res?.json(true);
  }

  async signUp({ authSignUpInDto }: SignUpInput) {
    await this.prismaService.transaction(async (transaction) => {
      const { clientId } = await this.clientService.create({ transaction });

      await Promise.all([
        this.organizationService.create({
          organizationCreateInDto: {
            cnpj: authSignUpInDto.cnpj,
            name: authSignUpInDto.name,
            clientId,
          },
          transaction,
        }),
        this.userService.create({
          userCreateInDto: {
            email: authSignUpInDto.email,
            fullName: authSignUpInDto.fullName,
            clientId,
            roleId: SEED_ROLE_ADMIN_ID,
          },
          transaction,
        }),
      ]);
    });

    return true;
  }

  async resetPassword({ authResetPasswordInDto }: ResetPasswordInput) {
    await this.userService.update({
      where: { isActive: true, email: authResetPasswordInDto.email },
      userUpdateInDto: { password: authResetPasswordInDto.password },
      clientId: authResetPasswordInDto.clientId,
    });

    return true;
  }

  async forgetPassword({ authForgetPasswordInDto }: ForgetPasswordInput) {
    const user = await this.userService.findOne({
      where: { email: authForgetPasswordInDto.email },
      select: { clientId: true },
      showNotFoundError: false,
    });

    if (!user) return true;

    const payload: AuthResetPassword = {
      email: authForgetPasswordInDto.email,
      clientId: user.clientId,
    };
    const token = this.jwtService.sign(payload);

    void this.emailService.sendEmail({
      to: authForgetPasswordInDto.email,
      title: 'Redefina sua senha',
      body: `${FRONTEND_URL}/?token=${token}`,
    });

    return true;
  }

  async requestChangePassword({
    requestChangePasswordInDto: requestChangePasswordInputInDto,
  }: RequestChangePasswordInput) {
    const user = await this.userService.findOne({
      where: { id: requestChangePasswordInputInDto.id },
      select: { email: true, clientId: true },
      clientId: requestChangePasswordInputInDto.clientId,
    });

    const payload: AuthResetPassword = {
      email: user!.email,
      clientId: user!.clientId,
    };
    const token = this.jwtService.sign(payload);

    void this.emailService.sendEmail({
      to: user!.email,
      title: 'Redefina sua senha',
      body: `${FRONTEND_URL}/?token=${token}`,
    });

    return true;
  }
}

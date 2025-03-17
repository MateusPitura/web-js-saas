import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthResetPassword,
  AuthSignin,
  ForgetPasswordInput,
  ResetPasswordInput,
  SiginInInput,
  SignOutInput,
  SignUpInput,
} from './auth.type';
import { compareSync } from 'bcrypt';
import { ClientService } from '../client/client.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../database/prisma.service';
import { generateRandomPassword } from '../utils/generateRandomPassword';
import { SEED_ROLE_ADMIN_ID } from '@shared/constants';
import { COOKIE_JWT_NAME, FRONTEND_URL } from 'src/constants';

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
        id: true,
        clientId: true,
        password: true,
      },
      showNotFoundError: false,
    });

    if (!user || !compareSync(authSignInInDto.password, user.password)) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload: AuthSignin = {
      clientId: user.clientId,
      userId: user.id,
    };

    const token = this.jwtService.sign(payload);

    res?.cookie(COOKIE_JWT_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res?.json(true);
  }

  signOut({ res }: SignOutInput) {
    res?.clearCookie(COOKIE_JWT_NAME);
    return res?.json(true);
  }

  async signUp({ authSignUpInDto }: SignUpInput) {
    await this.prismaService.transaction(async (transaction) => {
      const { clientId } = await this.clientService.create({ transaction });

      await this.organizationService.create({
        organizationCreateInDto: {
          cnpj: authSignUpInDto.cnpj,
          name: authSignUpInDto.name,
          clientId,
        },
        transaction,
      });

      await this.userService.create({
        userCreateInDto: {
          email: authSignUpInDto.email,
          fullName: authSignUpInDto.fullName,
          clientId,
          roleId: SEED_ROLE_ADMIN_ID,
        },
        transaction,
      });
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
      select: { id: true, clientId: true },
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

  generateRandomPassword() {
    return generateRandomPassword();
  }
}

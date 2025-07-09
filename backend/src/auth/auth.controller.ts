import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest, AuthRequestResetPassword } from './auth.type';
import {
  AuthGuard,
  AuthGuardResetPassword,
  AuthGuardSignOut,
} from './auth.guard';
import {
  AuthForgetPasswordInDto,
  AuthSignInInDto,
  AuthSignUpInDto,
  PasswordInDto,
} from './auth.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() authSignInInDto: AuthSignInInDto,
    @Res() res?: Response,
  ) {
    return await this.authService.signIn({
      authSignInInDto,
      res,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuardSignOut)
  @Post('sign-out')
  signOut(@Req() req: AuthRequest, @Res() res?: Response) {
    const { userId, clientId } = req.authToken;
    return this.authService.signOut({ userId, clientId, res });
  }

  @Post('sign-up')
  async signUp(@Body() authSignUpInDto: AuthSignUpInDto) {
    return await this.authService.signUp({ authSignUpInDto });
  }

  @Post('reset-password')
  @UseGuards(AuthGuardResetPassword)
  async resetPassword(
    @Req() req: AuthRequestResetPassword,
    @Body() { password }: PasswordInDto,
  ) {
    const { email, clientId } = req.authToken;
    return await this.authService.resetPassword({
      authResetPasswordInDto: {
        email,
        password,
        clientId,
      },
    });
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() authForgetPasswordInDto: AuthForgetPasswordInDto,
  ) {
    return await this.authService.forgetPassword({
      authForgetPasswordInDto,
    });
  }

  @Post('request-change-password')
  @UseGuards(AuthGuard)
  async requestChangePassword(@Req() req: AuthRequest) {
    const { userId, clientId } = req.authToken;

    return await this.authService.requestChangePassword({
      requestChangePasswordInDto: {
        id: userId,
        clientId,
      },
    });
  }
}

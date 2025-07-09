import { Request, Response } from 'express';
import {
  AuthForgetPasswordInDto,
  AuthResetPasswordInDto,
  AuthSignInInDto,
  AuthSignUpInDto,
  RequestChangePasswordInDto,
} from './auth.schema';
import { Permissions } from '@shared/types';

export interface AuthSignin {
  userId: number;
  clientId: number;
  jit: string;
  permissions: Permissions;
}

export interface AuthResetPassword {
  email: string;
  clientId: number;
}

export interface AuthRequest extends Request {
  authToken: AuthSignin;
}

export interface AuthRequestResetPassword extends Request {
  authToken: AuthResetPassword;
}

export interface SiginInInput {
  authSignInInDto: AuthSignInInDto;
  res?: Response;
}

export interface SignOutInput {
  clientId: number;
  userId: number;
  res?: Response;
}

export interface SignUpInput {
  authSignUpInDto: AuthSignUpInDto;
}

export interface ResetPasswordInput {
  authResetPasswordInDto: AuthResetPasswordInDto;
}

export interface ForgetPasswordInput {
  authForgetPasswordInDto: AuthForgetPasswordInDto;
}

export interface RequestChangePasswordInput {
  requestChangePasswordInDto: RequestChangePasswordInDto;
}

export interface CustomizeValidationProperties {
  shouldValidateJit: boolean;
  shouldValidateExpirationTime: boolean;
}

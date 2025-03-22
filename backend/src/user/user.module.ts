import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PdfModule } from 'src/pdf/pdf.module';
import { SheetModule } from 'src/sheet/sheet.module';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
    PdfModule,
    SheetModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

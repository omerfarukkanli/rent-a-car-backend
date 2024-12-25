import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleConfig from 'src/config/google.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule.forFeature(googleConfig), UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [],
})
export class AuthModule {}

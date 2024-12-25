import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SuccessResponseDto } from 'src/generic/dto/SuccessResponseDto';
import configuration from 'src/config/configuration';
import { ErrorResponseDto } from 'src/generic/dto/ErrorResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpWithGoogle(
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
  ) {
    const user = await this.userService.findByGoogleId(googleId);
    if (user) {
      throw new Error('User already exists');
    }

    const newUser = await this.userService.create({
      googleId,
      email,
      firstName,
      lastName,
    });
    return newUser;
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (user) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userService.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      return new SuccessResponseDto(
        true,
        HttpStatus.CREATED,
        'Kullanıcı oluşturuldu',
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async signIn(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new ErrorResponseDto(
          false,
          HttpStatus.NOT_FOUND,
          'Kullanıcı bulunamad',
          '/auth/signin',
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ErrorResponseDto(
          false,
          HttpStatus.UNAUTHORIZED,
          'Kullanıcı adı veya şifre hatalı',
          '/auth/signin',
        );
      }
      const payload = { email: user.email, sub: user._id };
      return new SuccessResponseDto(
        true,
        HttpStatus.CREATED,
        'Kullanıcı oluşturuldu',
        {
          access_token: this.jwtService.sign(payload, {
            secret: configuration().jwt.secret,
          }),
        },
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SuccessResponseDto } from 'src/generic/dto/SuccessResponseDto';
import configuration from 'src/config/configuration';
import { ErrorResponseDto } from 'src/generic/dto/ErrorResponseDto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
    };

    return this.jwtService.sign(payload, {
      secret: configuration().jwt.secret,
    });
  }

  private createSuccessResponse(user: any) {
    const access_token = this.generateToken(user);

    return new SuccessResponseDto(
      true,
      HttpStatus.OK,
      'User Login Successful',
      { access_token },
    );
  }

  async googleSignIn(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<SuccessResponseDto | HttpException> {
    try {
      let user = await this.userService.findOneByEmail(email);

      if (!user) {
        user = await this.userService.create({
          email,
          firstName,
          lastName,
        });
      }

      return this.createSuccessResponse(user);
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto | HttpException> {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (user) {
        throw new ErrorResponseDto(
          false,
          HttpStatus.BAD_REQUEST,
          'User Already Exists',
          'auth/signup',
        );
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      await this.userService.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      return new SuccessResponseDto(
        true,
        HttpStatus.CREATED,
        'User Created Successfully',
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto | HttpException> {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new ErrorResponseDto(
          false,
          HttpStatus.BAD_REQUEST,
          'User Not Found',
          'auth/login',
        );
      }
      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) {
        throw new ErrorResponseDto(
          false,
          HttpStatus.BAD_REQUEST,
          'Invalid Password',
          'auth/login',
        );
      }
      return this.createSuccessResponse(user);
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

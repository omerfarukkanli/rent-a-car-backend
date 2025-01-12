import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUserDto';
import { RegisterUserDto } from './dto/registerUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userDto: RegisterUserDto, @Res() res: Response) {
    const response = await this.authService.signup(
      userDto.email,
      userDto.password,
      userDto.firstName,
      userDto.lastName,
    );
    res.send(response);
  }

  @Post('signin')
  async signin(@Body() userDto: LoginUserDto, @Res() res: Response) {
    const response = await this.authService.login(
      userDto.email,
      userDto.password,
    );
    res.send(response);
  }
}

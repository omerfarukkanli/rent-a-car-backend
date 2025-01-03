import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto/loginUserDto';
import { RegisterUserDto } from './dto/registerUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async auth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const response = await this.authService.googleSignIn(
      req.user.email,
      req.user.firstName,
      req.user.lastName,
    );
    res.send(response);
    return res.redirect('http://localhost:3000');
  }

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

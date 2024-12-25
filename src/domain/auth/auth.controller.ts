import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = await this.authService.signUpWithGoogle(
      req.user.googleId,
      req.user.email,
      req.user.firstName,
      req.user.lastName,
    );
    return user;
  }
}

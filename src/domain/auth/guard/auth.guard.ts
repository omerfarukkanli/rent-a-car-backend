import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import configuration from 'src/config/configuration';
import { UserService } from 'src/domain/user/user.service';
import { UserRoles } from 'src/generic/user.role';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const payload = await this.jwtService.verifyAsync(token, {
      secret: configuration().jwt.secret,
    });

    if (!token) throw new UnauthorizedException();
    const userRoleInDb: UserRoles | undefined =
      await this.userService.findByEmailFromRole(payload.email);

    if (!userRoleInDb)
      throw new HttpException(FORBIDDEN_MESSAGE, HttpStatus.FORBIDDEN);

    try {
      const payload = this.jwtService.verify(token, {
        secret: configuration().jwt.secret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

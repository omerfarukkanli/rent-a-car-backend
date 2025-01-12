import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import configuration from 'src/config/configuration';
import { UserService } from 'src/domain/user/user.service';
import { UserRoles } from 'src/generic/enum/user.role.enum';

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

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: configuration().jwt.secret,
      });
      request.user = payload;
      const userRoleInDb = await this.userService.findByEmailFromRole(
        payload.email,
      );

      if (!userRoleInDb) {
        throw new HttpException('User role not found', HttpStatus.FORBIDDEN);
      }

      const requiredRoles = this.reflector.get<UserRoles[]>(
        'roles',
        context.getHandler(),
      );

      if (
        requiredRoles &&
        requiredRoles.length > 0 &&
        !requiredRoles.includes(userRoleInDb)
      ) {
        throw new HttpException(
          'Insufficient permissions',
          HttpStatus.FORBIDDEN,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

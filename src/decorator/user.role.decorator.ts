import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/generic/user.role';

export const Roles = Reflector.createDecorator<UserRoles[]>();

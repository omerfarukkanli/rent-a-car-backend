import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ default: 'test@gmail.com' })
  email: string;

  @ApiProperty({ default: 'password' })
  password: string;
}

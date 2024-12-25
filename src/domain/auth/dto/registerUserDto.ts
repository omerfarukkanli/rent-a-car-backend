import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ default: 'test@gmail.com' })
  email: string;

  @ApiProperty({ default: 'password' })
  password: string;

  @ApiProperty({ default: 'test' })
  firstName: string;

  @ApiProperty({ default: 'user' })
  lastName: string;
}

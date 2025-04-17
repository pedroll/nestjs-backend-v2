import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import EnvConfig from '../../config/app.config';

const configService = new ConfigService({ app: EnvConfig() });

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    minLength: 6,
    maxLength: 50,
  })
  @IsEmail()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 50,
    pattern: '/(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*/',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(new RegExp(configService.get('app.passwordPattern')!), {
    message: `The password must have a Uppercase, lowercase letter and a number ${configService.get('app.passwordPattern')}`,
  })
  password: string;
}

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

export class CreateUserDto {
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
    pattern: configService.get('app.passwordPattern'),
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(new RegExp(configService.get('app.passwordPattern')!), {
    message: `The password must have a Uppercase, lowercase letter and a number ${configService.get('app.passwordPattern')}`,
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  fullName: string;
}

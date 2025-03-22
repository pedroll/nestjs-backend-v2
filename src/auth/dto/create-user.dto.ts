import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../../config/app.config';

const configService = new ConfigService({ app: EnvConfig() });

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(configService.get('passwordPattern')!, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  fullName: string;
}

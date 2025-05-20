import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AudioToTextDto {
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The audio file to be transcribed',
  })
  @IsDefined()
  @Type(() => Object)
  audio: Express.Multer.File;
}

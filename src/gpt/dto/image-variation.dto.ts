import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageVariationDto {
  @ApiProperty({
    description: 'Image to variate',
  })
  @IsString()
  @IsNotEmpty()
  readonly baseImage: string;
}

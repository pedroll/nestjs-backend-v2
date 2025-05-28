import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ImageVariationDto {
  @ApiProperty({
    description: 'Image to variate',
  })
  @IsString()
  readonly baseImage: string;
}

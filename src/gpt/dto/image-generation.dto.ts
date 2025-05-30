import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageGenerationDto {
  @ApiProperty({ description: 'The text prompt for image generation' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Optional base64 encoded original image for edits',
  })
  @IsOptional()
  @IsString()
  readonly originalImage?: string;

  @ApiPropertyOptional({
    description: 'Optional base64 encoded mask image for inpainting',
  })
  @IsString()
  @IsOptional()
  readonly maskImage?: string;
}

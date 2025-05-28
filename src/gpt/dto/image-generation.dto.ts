import { IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImagesResponse } from 'openai/resources/images'; // Import as a class

export class ImageGenerationDto {
  @ApiProperty({ description: 'The text prompt for image generation' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Optional base64 encoded original image for edits',
  })
  @IsOptional()
  @IsObject()
  // @ts-expect-error type error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Type(() => ImagesResponse)
  readonly originalImage?: ImagesResponse;

  @ApiPropertyOptional({
    description: 'Optional base64 encoded mask image for inpainting',
  })
  @IsString()
  @IsOptional()
  readonly maskImage?: string;
}

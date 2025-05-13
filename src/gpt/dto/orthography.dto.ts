import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  prompt: string;

  @IsInt()
  @IsOptional()
  maxTokens?: number;
}

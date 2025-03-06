import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock?: number;

  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @IsIn(['man', 'woman', 'kids', 'unisex'])
  @IsString({ each: true })
  gender?: string;
}

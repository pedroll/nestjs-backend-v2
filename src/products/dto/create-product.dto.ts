import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
    required: true,
    nullable: false,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 100,
    description: 'The price of the product',
    required: false,
    default: 0,
    nullable: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    example: 'This is a product description',
    description: 'The description of the product',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'product-slug',
    description: 'The slug of the product',
    required: false,
    uniqueItems: true,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 10,
    description: 'The stock quantity of the product',
    required: false,
    default: 0,
    nullable: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'The available sizes of the product',
    default: [],
    nullable: true,
  })
  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'The gender category of the product',
    nullable: true,
  })
  @IsIn(['man', 'woman', 'kids', 'unisex'])
  @IsString({ each: true })
  gender: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'The tags associated with the product',
    required: false,
    default: [],
    nullable: true,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'The images of the product',
    required: false,
    default: [],
    nullable: true,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

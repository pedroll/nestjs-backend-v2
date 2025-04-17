import { IsIn, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description:
      'The number of items to skip before starting to collect the result set',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number) // transformación explicita en lugar de explicita
  offset: number;

  @ApiProperty({
    example: 10,
    description: 'The number of items to return',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number) // transformación explicita en lugar de explicita
  limit: number;

  @ApiProperty({
    enum: ['men', 'women', 'unisex', 'kid'],
    description: 'Filter results by gender',
    default: '',
  })
  @IsOptional()
  @IsIn(['men', 'women', 'unisex', 'kid'])
  gender: 'men' | 'women' | 'unisex' | 'kid';
}

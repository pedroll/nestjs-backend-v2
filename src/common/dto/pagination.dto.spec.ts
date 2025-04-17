import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  let dto: PaginationDto;

  beforeEach(() => {
    dto = new PaginationDto();
  });

  describe('offset validation', () => {
    it('should pass with valid offset', async () => {
      dto = plainToInstance(PaginationDto, { offset: 1 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with negative offset', async () => {
      dto = plainToInstance(PaginationDto, { offset: -1 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should fail with zero offset', async () => {
      dto = plainToInstance(PaginationDto, { offset: 0 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail with non-integer offset', async () => {
      dto = plainToInstance(PaginationDto, { offset: 1.5 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  });

  describe('limit validation', () => {
    it('should pass with valid limit', async () => {
      dto = plainToInstance(PaginationDto, { limit: 10 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with negative limit', async () => {
      dto = plainToInstance(PaginationDto, { limit: -1 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should fail with zero limit', async () => {
      dto = plainToInstance(PaginationDto, { limit: 0 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('min');
    });

    it('should fail with non-integer limit', async () => {
      dto = plainToInstance(PaginationDto, { limit: 1.5 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  });

  describe('gender validation', () => {
    it('should pass with valid gender values', async () => {
      const validGenders = ['men', 'women', 'unisex', 'kid'];

      for (const gender of validGenders) {
        dto = plainToInstance(PaginationDto, { gender });
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should fail with invalid gender value', async () => {
      dto = plainToInstance(PaginationDto, { gender: 'invalid' });
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isIn');
    });
  });

  describe('dto behavior', () => {
    it('should pass with optional values omitted', async () => {
      dto = plainToInstance(PaginationDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should transform string numbers to numbers', () => {
      dto = plainToInstance(PaginationDto, {
        offset: '1',
        limit: '10',
      });

      expect(dto.offset).toBe(1);
      expect(dto.limit).toBe(10);
      expect(typeof dto.offset).toBe('number');
      expect(typeof dto.limit).toBe('number');
    });
  });
});

import { validate } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateProductDto', () => {
  let dto: CreateProductDto;

  beforeEach(() => {
    dto = new CreateProductDto();
    dto.name = 'Product name'; // Required field
  });

  const validateField = async <T>(
    field: keyof CreateProductDto,
    value: T,
    expectedErrors?: { type: string; value?: T }[],
  ) => {
    // @ts-ignore
    dto[field] = value as any;
    const errors = await validate(dto);
    const fieldErrors = errors.find((error) => error.property === field);

    if (!expectedErrors) {
      expect(errors.filter((e) => e.property === field)).toHaveLength(0);
      return;
    }

    expect(errors.length).toBeGreaterThan(0);
    expectedErrors.forEach(({ type }) => {
      expect(fieldErrors?.constraints).toHaveProperty(type);
    });
  };

  describe('field validations', () => {
    // Name validations
    it('validates correct name', () => validateField('name', 'Valid name'));
    it('fails with invalid name type', () =>
      validateField('name', 123, [{ type: 'isString' }]));
    it('fails with short name', () =>
      validateField('name', 'Ab', [{ type: 'minLength' }]));

    // Price validations
    it('validates correct price', () => validateField('price', 100));
    it('fails with invalid price type', () =>
      validateField('price', 'invalid', [{ type: 'isNumber' }]));
    it('fails with negative price', () =>
      validateField('price', -1, [{ type: 'isPositive' }]));

    // Description validations
    it('validates correct description', () =>
      validateField('description', 'Valid description'));
    it('fails with invalid description type', () =>
      validateField('description', 123, [{ type: 'isString' }]));

    // Stock validations
    it('validates correct stock', () => validateField('stock', 10));
    it('fails with invalid stock type', () =>
      validateField('stock', 'invalid', [{ type: 'isNumber' }]));
    it('fails with negative stock', () =>
      validateField('stock', -1, [{ type: 'isPositive' }]));

    // Sizes validations
    it('validates correct sizes', () =>
      validateField('sizes', ['S', 'M', 'L']));
    it('fails with invalid size type', () =>
      validateField('sizes', ['S', 'M', 1], [{ type: 'isString' }]));
    it('fails with non-array sizes', () =>
      validateField('sizes', 'invalid', [{ type: 'isArray' }]));

    // Tags validations
    it('validates correct tags', () => validateField('tags', ['tag1', 'tag2']));
    it('fails with invalid tag type', () =>
      validateField('tags', ['tag1', 123], [{ type: 'isString' }]));
    it('fails with non-array tags', () =>
      validateField('tags', 'invalid', [{ type: 'isArray' }]));

    // Images validations
    it('validates correct images', () =>
      validateField('images', ['image1.jpg', 'image2.jpg']));
    it('fails with invalid image type', () =>
      validateField('images', ['image1.jpg', 123], [{ type: 'isString' }]));
    it('fails with non-array images', () =>
      validateField('images', 'invalid-image', [{ type: 'isArray' }]));

    // Gender validations
    it('validates correct gender', () => validateField('gender', 'man'));
    it('fails with invalid gender type', () =>
      validateField('gender', 123, [{ type: 'isString' }]));
  });

  describe('CreateProductDto @Type(() => Number) transformation', () => {
    it('should transform numeric strings to numbers', async () => {
      const input = {
        name: 'Sample Product',
        price: '99.99', // String input supposed to be a number
        stock: '50', // String input supposed to be a number
        sizes: [],
      };

      const dtoPlain = plainToInstance(CreateProductDto, input);

      // Check transformations
      expect(dtoPlain.price).toBe(99.99);
      expect(dtoPlain.stock).toBe(50);
      expect(typeof dtoPlain.price).toBe('number');
      expect(typeof dtoPlain.stock).toBe('number');

      // Validate to ensure no other constraints are violated
      const errors = await validate(dtoPlain);
      expect(errors).toHaveLength(0);
    });

    it('should add validation error for non-numeric string in number fields', async () => {
      const input = {
        name: 'Sample Product',
        price: 'not-a-number', // Incorrect input for testing validation
        sizes: [],
      };

      const dtoPlain = plainToInstance(CreateProductDto, input);
      const errors = await validate(dtoPlain);

      // Check for validation errors
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.map((err) => err.constraints)).toMatchObject([
        { isNumber: expect.any(String) },
      ]);
    });
  });
});

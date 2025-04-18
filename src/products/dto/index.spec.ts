import { CreateProductDto, UpdateProductDto } from './index';

describe('DTO exports', () => {
  it('should export CreateProductDto', () => {
    expect(CreateProductDto).toBeDefined();
    expect(new CreateProductDto()).toBeInstanceOf(CreateProductDto);
  });

  it('should export UpdateProductDto', () => {
    expect(UpdateProductDto).toBeDefined();
    expect(new UpdateProductDto()).toBeInstanceOf(UpdateProductDto);
  });
});

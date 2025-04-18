import { User } from './user.entity';
import { Product } from '../../products/entities/product.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.id = 'test-uuid';
    user.email = 'Test@Example.com';
    user.password = 'Password123!';
    user.fullName = 'John Doe';
    user.isActive = true;
    user.roles = ['user'];
  });

  it('should instantiate a User entity with correct fields', () => {
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe('test-uuid');
    expect(user.email).toBe('Test@Example.com');
    expect(user.password).toBe('Password123!');
    expect(user.fullName).toBe('John Doe');
    expect(user.isActive).toBe(true);
    expect(user.roles).toEqual(['user']);
    // createdAt and updatedAt are supposed to be undefined before hooks
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
  });

  describe('checkFieldsBeforeInsert', () => {
    it('should lowercase and trim email, and set createdAt date', () => {
      user.email = '   UPPER@DOMAIN.COM   ';
      const before = new Date();
      user.checkFieldsBeforeInsert();
      const after = new Date();

      expect(user.email).toBe('upper@domain.com');
      expect(user.createdAt).toBeInstanceOf(Date);
      // Check createdAt is between before/after
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('checkFieldsBeforeUpdate', () => {
    it('should lowercase and trim email, and set updatedAt date', () => {
      user.email = '  Another@EXample.COM ';
      const before = new Date();
      user.checkFieldsBeforeUpdate();
      const after = new Date();

      expect(user.email).toBe('another@example.com');
      expect(user.updatedAt).toBeInstanceOf(Date);
      // Check updatedAt is between before/after
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  // it('default roles array should include "user"', () => {
  //   // In real use, this comes from DB default,
  //   // but test in case someone does not actively set roles
  //   const newUser = new User();
  //   console.log(newUser.roles);
  //   expect(Array.isArray(newUser.roles)).toBeTruthy();
  // });

  // If you want to test relationships, mock the Product import
  // it('can assign a product relationship', () => {
  //   // We'll use a minimal stub for Product
  //   const fakeProduct: Partial<Product> = { id: 'product-123', user: user };
  //   user.product = fakeProduct as Product;
  //   expect(user.product).toBe(fakeProduct);
  // });

  // it('should allow assignment to the product property (OneToMany)', () => {
  //   const fakeProduct = { id: 'product-1', user };
  //
  //   user.product = fakeProduct as Product;
  //
  //   expect(user.product).toBe(fakeProduct);
  //   expect(user.product.id).toBe('product-1');
  //   expect(user.product.user).toBe(user);
  // });

  it('should allow assignment of a single Product to product property', () => {
    const user = new User();
    const fakeProduct: any = { id: 'p1', name: 'TestProduct', user };
    user.product = fakeProduct;
    expect(user.product).toBe(fakeProduct);
    expect(user.product.user).toBe(user);
  });
});

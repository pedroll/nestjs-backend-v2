import { validate } from 'class-validator';
import { UpdateAuthDto } from './update-auth.dto';
import { ConfigService } from '@nestjs/config';
import EnvConfig from '../../config/app.config';

describe('UpdateAuthDto', () => {
  let dto: UpdateAuthDto;

  beforeEach(() => {
    dto = new UpdateAuthDto();
  });

  it('should pass validation with empty object (all fields optional)', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe('email validation when provided', () => {
    it('should pass with valid email', async () => {
      dto.email = 'test@example.com';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with invalid email format', async () => {
      dto.email = 'invalid-email';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail with email shorter than 6 characters', async () => {
      dto.email = 'a@b.c';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail with email longer than 50 characters', async () => {
      dto.email = 'a'.repeat(45) + '@example.com';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('password validation when provided', () => {
    it('should pass with valid password', async () => {
      dto.password = 'Password123!';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with password shorter than 6 characters', async () => {
      dto.password = 'Ab1!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail with password longer than 50 characters', async () => {
      dto.password = 'Aa1!' + 'a'.repeat(47);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail when password does not match pattern', async () => {
      dto.password = 'password';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('fullName validation when provided', () => {
    it('should pass with valid fullName', async () => {
      dto.fullName = 'John Doe';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with fullName shorter than 3 characters', async () => {
      dto.fullName = 'Jo';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail with fullName longer than 50 characters', async () => {
      dto.fullName = 'A'.repeat(51);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('partial updates', () => {
    it('should pass with only email update', async () => {
      dto.email = 'test@example.com';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with only password update', async () => {
      dto.password = 'Password123!';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with only fullName update', async () => {
      dto.fullName = 'John Doe';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with multiple field updates', async () => {
      dto.email = 'test@example.com';
      dto.fullName = 'John Doe';
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});

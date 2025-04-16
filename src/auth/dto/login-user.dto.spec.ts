import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

describe('LoginUserDto', () => {
  let dto: LoginUserDto;

  beforeEach(() => {
    dto = new LoginUserDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
  });

  describe('email validation', () => {
    it('should pass with valid email', async () => {
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

    it('should fail when email is empty', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('password validation', () => {
    it('should pass with valid password', async () => {
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

    it('should fail without uppercase letter', async () => {
      dto.password = 'password123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('should fail without lowercase letter', async () => {
      dto.password = 'PASSWORD123!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });

    it('should fail without number', async () => {
      dto.password = 'Password!';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });
});

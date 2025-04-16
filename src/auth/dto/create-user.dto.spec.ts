import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('email validation', () => {
    it('should validate a correct email', async () => {
      dto.email = 'test@example.com';
      const errors = await validate(dto);
      const emailErrors = errors.filter((error) => error.property === 'email');
      expect(emailErrors).toHaveLength(0);
    });

    it('should fail with an invalid email', async () => {
      dto.email = 'invalid-email';
      const errors = await validate(dto);
      const emailErrors = errors.filter((error) => error.property === 'email');
      expect(emailErrors).toHaveLength(1);
    });

    it('should fail with a short email', async () => {
      dto.email = 'a@b.c';
      const errors = await validate(dto);
      const emailErrors = errors.filter((error) => error.property === 'email');
      expect(emailErrors).toHaveLength(1);
    });

    it('should fail with a long email', async () => {
      dto.email = 'a'.repeat(45) + '@example.com';
      const errors = await validate(dto);
      const emailErrors = errors.filter((error) => error.property === 'email');
      expect(emailErrors).toHaveLength(1);
    });
  });

  describe('password validation', () => {
    it('should validate a correct password', async () => {
      dto.password = 'Password123!';
      const errors = await validate(dto);
      const passwordErrors = errors.filter(
        (error) => error.property === 'password',
      );
      expect(passwordErrors).toHaveLength(0);
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

    it('should fail with a password without uppercase', async () => {
      dto.password = 'password123!';
      const errors = await validate(dto);
      // console.log(errors);
      const passwordErrors = errors.filter(
        (error) => error.property === 'password',
      );
      // console.log(passwordErrors);
      expect(passwordErrors).toHaveLength(1);
    });

    it('should fail with a password without lowercase', async () => {
      dto.password = 'PASSWORD123!';
      const errors = await validate(dto);
      const passwordErrors = errors.filter(
        (error) => error.property === 'password',
      );
      expect(passwordErrors).toHaveLength(1);
    });

    it('should fail with a password without numbers', async () => {
      dto.password = 'Password!!';
      const errors = await validate(dto);
      const passwordErrors = errors.filter(
        (error) => error.property === 'password',
      );
      expect(passwordErrors).toHaveLength(1);
    });
  });

  describe('fullName validation', () => {
    it('should validate a correct full name', async () => {
      dto.fullName = 'John Doe';
      const errors = await validate(dto);
      const fullNameErrors = errors.filter(
        (error) => error.property === 'fullName',
      );
      expect(fullNameErrors).toHaveLength(0);
    });

    it('should fail with a short full name', async () => {
      dto.fullName = 'Jo';
      const errors = await validate(dto);
      const fullNameErrors = errors.filter(
        (error) => error.property === 'fullName',
      );
      expect(fullNameErrors).toHaveLength(1);
    });

    it('should fail with a long full name', async () => {
      dto.fullName = 'J'.repeat(51);
      const errors = await validate(dto);
      const fullNameErrors = errors.filter(
        (error) => error.property === 'fullName',
      );
      expect(fullNameErrors).toHaveLength(1);
    });

    it('should fail with non-string full name', async () => {
      // @ts-expect-error - Testing invalid type
      dto.fullName = 123;
      const errors = await validate(dto);
      const fullNameErrors = errors.filter(
        (error) => error.property === 'fullName',
      );
      expect(fullNameErrors).toHaveLength(1);
    });
  });

  describe('complete dto validation', () => {
    it('should validate a complete valid dto', async () => {
      dto.email = 'test@example.com';
      dto.password = 'Password123!';
      dto.fullName = 'John Doe';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with empty dto', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toHaveLength(3); // one error for each required field
    });
  });
});

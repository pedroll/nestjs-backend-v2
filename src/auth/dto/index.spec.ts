import { CreateUserDto, LoginUserDto, UpdateAuthDto } from './index';

describe('DTO exports', () => {
  it('should export CreateUserDto', () => {
    expect(CreateUserDto).toBeDefined();
    expect(new CreateUserDto()).toBeInstanceOf(CreateUserDto);
  });

  it('should export LoginUserDto', () => {
    expect(LoginUserDto).toBeDefined();
    expect(new LoginUserDto()).toBeInstanceOf(LoginUserDto);
  });

  it('should export UpdateAuthDto', () => {
    expect(UpdateAuthDto).toBeDefined();
    expect(new UpdateAuthDto()).toBeInstanceOf(UpdateAuthDto);
  });
});

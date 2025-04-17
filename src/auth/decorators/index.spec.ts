import { RawHeaders, GetUser, Auth, RoleProtected } from './index';

describe('Decorator exports', () => {
  it('should export RawHeaders', () => {
    expect(RawHeaders).toBeDefined();
  });

  it('should export GetUser', () => {
    expect(GetUser).toBeDefined();
  });

  it('should export Auth', () => {
    expect(Auth).toBeDefined();
  });

  it('should export RoleProtected', () => {
    expect(RoleProtected).toBeDefined();
  });
});

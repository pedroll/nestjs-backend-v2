import { JwtPayload } from './jwt-payload.interface';

describe('JwtPayloadInterface', () => {
  it('should accept a valid payload with string id', () => {
    const payload: JwtPayload = {
      id: '123e4567-e89b-12d3-a456-426614174000',
    };

    // Type checking is done at compile time
    // This test verifies the structure is correct
    expect(payload.id).toBeDefined();
    expect(typeof payload.id).toBe('string');
  });

  it('should not accept a payload without id', () => {
    // @ts-expect-error - Testing invalid payload
    const invalidPayload: JwtPayload = {};

    expect(invalidPayload).toBeDefined();
    expect('id' in invalidPayload).toBeFalsy();
  });

  it('should not accept a payload with invalid id type', () => {
    const invalidPayload: JwtPayload = {
      // @ts-expect-error for test
      id: 123, // number instead of string
    };

    expect(typeof invalidPayload.id).not.toBe('string');
  });

  it('should not accept additional properties', () => {
    const payloadWithExtra: JwtPayload = {
      id: '123',
      // @ts-expect-error for test
      extraProp: 'invalid',
    };

    const validKeys = Object.keys(payloadWithExtra).filter(
      (key) => key === 'id',
    );
    expect(validKeys).toHaveLength(1);
  });
});

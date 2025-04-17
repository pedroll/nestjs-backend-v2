import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRawHeaders, RawHeaders } from './get-raw-headers.decorator';
import { User } from '../entities/user.entity';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn().mockImplementation(() => jest.fn()),
  // createParamDecorator: jest.fn().mockImplementation(() => jest.fn()), // opción para tener mas cuerpo para prueba mas profunda
}));

describe('RawHeaders decorator', () => {
  beforeEach(() => {
    //jest.clearAllMocks();
  });

  const mockRawHeaders = [
    'Authorization',
    'Bearer token',
    'User-Agent',
    'NestJS',
  ];

  const createMockExecutionContext = (
    rawHeaders: string[] | object | undefined,
  ): ExecutionContext =>
    ({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          rawHeaders,
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should return all raw headers from request when no data is provided', () => {
    const mockExecutionContext = createMockExecutionContext(mockRawHeaders);
    const result = getRawHeaders('', mockExecutionContext);

    expect(result).toEqual(mockRawHeaders);
  });

  it('should return specific header when data is provided', () => {
    const mockRawHeaders = {
      authorization: 'Bearer token',
      'content-type': 'application/json',
    };
    const mockExecutionContext = createMockExecutionContext(mockRawHeaders);

    const result = getRawHeaders('authorization', mockExecutionContext);
    expect(result).toBe('Bearer token');
  });

  it('should throw error when rawHeaders is undefined', () => {
    const mockExecutionContext = createMockExecutionContext(undefined);

    expect(() => {
      getRawHeaders(
        'undefined',
        mockExecutionContext as unknown as ExecutionContext,
      );
    }).toThrow('Raw headers not found');
  });

  it('should call createParamDecorator with getRawHeaders', () => {
    expect(createParamDecorator).toHaveBeenCalledWith(getRawHeaders);
  });
});

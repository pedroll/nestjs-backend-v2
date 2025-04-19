import { bootstrap } from './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockReturnValue({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    build: jest.fn(),
  }),
  SwaggerModule: {
    setup: jest.fn().mockReturnThis(),
  },
}));

jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockReturnValue({
    log: jest.fn().mockReturnValue(''),
  }),
  ValidationPipe: jest.requireActual('@nestjs/common').ValidationPipe,
}));

jest.mock('./app.module', () => ({
  AppModule: jest.fn().mockReturnValue('AppModule'),
}));

describe('Main.ts', () => {
  it('should configure the Nest application', async () => {
    await bootstrap();
  });
});

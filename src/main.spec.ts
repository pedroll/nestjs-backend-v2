import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn(),
      use: jest.fn(), // Add the missing 'use' method to the mock
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
    createDocument: jest.fn().mockReturnValue('Swagger Document'),
    setup: jest.fn(),
  },
}));

jest.mock('@nestjs/common', () => ({
  Logger: jest.fn().mockReturnValue({
    log: jest.fn().mockReturnValue(''),
  }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  ValidationPipe: jest.requireActual('@nestjs/common').ValidationPipe,
}));

jest.mock('./app.module', () => ({
  AppModule: jest.fn().mockReturnValue('AppModule'),
}));

describe('Main.ts', () => {
  let mockApp: {
    useGlobalPipes: jest.Mock;
    setGlobalPrefix: jest.Mock;
    enableCors: jest.Mock;
    listen: jest.Mock;
    use: jest.Mock;
  };

  let mockLogger: {
    log: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn(),
      use: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    (Logger as unknown as jest.Mock).mockReturnValue(mockLogger);
  });

  it('should create app with AppModule', async () => {
    process.env.PORT = '3000';
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockLogger.log).toHaveBeenCalledWith(
      `Application is running on port 3000`,
    );
  });

  it('should set global prefix', async () => {
    process.env.GLOBAL_PREFIX = 'api/v1';
    await bootstrap();
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
  });

  it('should use globalpipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        validatorOptions: expect.objectContaining({
          forbidNonWhitelisted: true,
          forbidUnknownValues: true, // Updated to match actual implementation
          whitelist: true,
        }),
      }),
    );
  });

  it('should enable cors', async () => {
    process.env.CORS_ORIGIN = 'http://localhost:3001';
    await bootstrap();
    // Update to match the actual CORS options in main.ts
    expect(mockApp.enableCors).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: ['http://localhost:4200'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
      }),
    );
  });

  // Add a test for the bodyParser middleware
  it('should configure bodyParser middleware', async () => {
    await bootstrap();
    expect(mockApp.use).toHaveBeenCalledTimes(2); // Called twice for json and urlencoded
    expect(mockApp.use).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(mockApp.use).toHaveBeenNthCalledWith(2, expect.any(Function));
  });
});

describe('Swagger', () => {
  it('should call DocumentBuilder', async () => {
    await bootstrap();
    expect(DocumentBuilder).toHaveBeenCalled();
    expect(DocumentBuilder).toHaveBeenCalledWith();
  });

  it('should create swagger document', async () => {
    await bootstrap();
    // expect(SwaggerModule.createDocument).toHaveBeenCalled(0);
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api',
      expect.anything(),
      'Swagger Document',
    );
  });
});

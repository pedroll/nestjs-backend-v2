import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: ['http://localhost:4200'], // Allow requests from Angular frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina los atributos que no esten en el dto
      forbidNonWhitelisted: true, // devuelve error si hay atributos que no esten en el dto
      forbidUnknownValues: true,
      // transform: true, // transforma los datos a los tipos que se especifican en el dto
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? 'api/v1');

  const config = new DocumentBuilder()
    .setTitle('NestJs bootstrap Restfull API')
    .setDescription('API description')
    .setVersion('1.0')
    // .addTag('teslo')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors(corsOptions);
  //app.enableCors(options);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

void bootstrap();

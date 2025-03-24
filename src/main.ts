import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina los atributos que no esten en el dto
      forbidNonWhitelisted: true, // devuelve error si hay atributos que no esten en el dto
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
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { join } from 'path';

import { AppService } from './app.service';
import { EnvConfig } from '../config/app.config';
import { joiValidationSchema } from '../config/joiValidationSchema';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: joiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('SYNC_ENTITIES'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get<boolean>('MONGO_URI')}:${configService.get<boolean>('MONGO_PORT')}/${configService.get<boolean>('MONGO_DB')}`,
      }),
      inject: [ConfigService],
    }), // Mongoose connection
    ProductsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

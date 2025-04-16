import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { join } from 'path';

import { AppService } from './app.service';
import EnvConfig from './config/app.config';
import { joiValidationSchema } from './config/joiValidationSchema';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: joiValidationSchema,
      load: [EnvConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ssl: configService.get('postgres.ssl'),
        extra: configService.get('postgres.extra'),
        type: 'postgres',
        host: configService.get<string>('postgres.dbHost'),
        port: configService.get<number>('postgres.port'),
        username: configService.get<string>('postgres.dbUser'),
        password: configService.get<string>('postgres.dbPassword'),
        database: configService.get<string>('postgres.dbName'),
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('postgres.syncEntities'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get<string>('mongoDb.uri')}:${configService.get<number>('mongoDb.port')}/${configService.get<string>('mongoDb.dbName')}`,
      }),
      inject: [ConfigService],
    }), // Mongoose connection
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessagesWsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

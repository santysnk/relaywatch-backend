import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({       // lee el archivo .env
      isGlobal: true,            // disponible en toda la app sin re-importar
    }),
    TypeOrmModule.forRootAsync({ // conecta con MySQL usando credenciales del .env
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') ?? '3306', 10), // string → número
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [],            // se completa al crear las entidades
        autoLoadEntities: true,  // detecta entidades registradas en otros módulos
        synchronize: false,      // TypeORM no toca el schema (lo maneja schema.sql)
        logging: true,           // imprime cada query SQL en consola
      }),
    }),
  ],
  controllers: [AppController],  // controladores HTTP del módulo raíz
  providers: [AppService],       // servicios inyectables del módulo raíz
})
export class AppModule {}

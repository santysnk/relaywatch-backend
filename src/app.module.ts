import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RegistradoresModule } from './registradores/registradores.module';
import { ParametrosModule } from './parametros/parametros.module';
import { RelacionesTransformacionModule } from './relaciones-transformacion/relaciones-transformacion.module';
import { ConfigRegistradorModule } from './config-registrador/config-registrador.module';
import { LecturasModule } from './lecturas/lecturas.module';
import { TitulosPanelesModule } from './titulos-paneles/titulos-paneles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({       // lee el archivo .env
      isGlobal: true,            // disponible en toda la app sin re-importar
    }),
    ScheduleModule.forRoot(),     // habilita tareas programadas (cron jobs)
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
    UsuariosModule,
    RegistradoresModule,
    ParametrosModule,
    RelacionesTransformacionModule,
    ConfigRegistradorModule,
    LecturasModule,
    TitulosPanelesModule,
    AuthModule,
  ],
  controllers: [AppController],  // controladores HTTP del módulo raíz
  providers: [AppService],       // servicios inyectables del módulo raíz
})
export class AppModule {}

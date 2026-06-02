import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';   // ← NUEVO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

   // ─── Configuración de Swagger ───────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('RelayWatch API')
    .setDescription('API del sistema de monitoreo de registradores eléctricos')
    .setVersion('1.0')
    .addBearerAuth()   // ← habilita el botón "Authorize" para pegar el token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);   // ← la doc queda en /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

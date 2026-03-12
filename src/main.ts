import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors();

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Stylo API')
    .setDescription('Stylo fashion e-commerce backend REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Set global prefix
  app.setGlobalPrefix('v1');

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`🚀 Stylo API running on http://localhost:${port}/v1`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api`);
}
bootstrap();

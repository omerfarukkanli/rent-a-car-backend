import { NestFactory } from '@nestjs/core';
import { AppModule } from './domain/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './handler/exception.handler';
import { LoggingInterceptor } from './handler/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(8081);
}
bootstrap();

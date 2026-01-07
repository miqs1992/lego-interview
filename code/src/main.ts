import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './shared/config/configuration/configuration.service';
import { mqttConfig } from './shared/queue/mqtt.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigurationService);

  app.connectMicroservice(mqttConfig(configService));

  const config = new DocumentBuilder()
    .setTitle('LEGO interview')
    .setDescription('API designed for 14.01.26 LEGO interview task')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(configService.port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

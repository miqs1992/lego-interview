import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './shared/config/configuration/configuration.service';
import { mqttConfig } from "./shared/queue/mqtt.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigurationService);

  app.connectMicroservice(
    mqttConfig(configService)
  );

  await app.startAllMicroservices();
  await app.listen(configService.port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

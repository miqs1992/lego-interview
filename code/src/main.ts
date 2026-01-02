import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './shared/config/configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigurationService);

  await app.listen(configService.port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

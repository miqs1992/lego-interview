import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database';
import { ConfigurationModule } from './shared/config/configuration';
import { QueueModule } from './shared/queue/queue.module';
import { FactoryModule } from './factory/factory.module';

@Module({
  imports: [DatabaseModule, ConfigurationModule, QueueModule, FactoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

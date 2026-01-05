import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database';
import { ConfigurationModule } from './shared/config/configuration';
import { QueueModule } from './shared/queue/queue.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [DatabaseModule, ConfigurationModule, QueueModule, DeviceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

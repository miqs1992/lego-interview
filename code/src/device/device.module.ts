import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { QueueModule } from "../shared/queue/queue.module";
import { DatabaseModule } from "../shared/database/database";

@Module({
  controllers: [DeviceController],
  imports: [QueueModule, DatabaseModule],
  providers: [],
})
export class DeviceModule {}

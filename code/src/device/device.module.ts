import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { QueueModule } from '../shared/queue/queue.module';
import { DatabaseModule } from '../shared/database/database';
import { DeviceService } from './device.service';
import { DeviceListenerController } from './device-listener.controller';
import { FakeDeviceController } from './fake-device.controller';

@Module({
  controllers: [DeviceController, FakeDeviceController, DeviceListenerController],
  imports: [QueueModule, DatabaseModule],
  providers: [DeviceService],
})
export class DeviceModule {}

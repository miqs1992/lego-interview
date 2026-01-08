import { Module } from '@nestjs/common';
import { DeviceController } from './controllers/device.controller';
import { QueueModule } from '../shared/queue/queue.module';
import { DatabaseModule } from '../shared/database/database';
import { DeviceService } from './services/device.service';
import { DeviceListenerController } from './controllers/device-listener.controller';
import { FakeDeviceController } from './controllers/fake-device.controller';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';

@Module({
  controllers: [DeviceController, FakeDeviceController, DeviceListenerController, GroupController],
  imports: [QueueModule, DatabaseModule],
  providers: [DeviceService, GroupService],
})
export class FactoryModule {}

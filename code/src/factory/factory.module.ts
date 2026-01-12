import { Module } from '@nestjs/common';
import { DeviceController } from './controllers/device.controller';
import { QueueModule } from '../shared/queue/queue.module';
import { DatabaseModule } from '../shared/database/database';
import { DeviceService } from './services/device.service';
import { DeviceListenerController } from './controllers/device-listener.controller';
import { FakeDeviceController } from './controllers/fake-device.controller';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { DataService } from './services/data.service';

@Module({
  controllers: [DeviceController, FakeDeviceController, DeviceListenerController, GroupController],
  imports: [QueueModule, DatabaseModule],
  providers: [DeviceService, GroupService, DataService],
})
export class FactoryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from '../../config/configuration/configuration.service';
import { typeOrmConfig } from './typeorm.config';
import { GroupEntity } from './entities/group.entity';
import { DeviceEntity } from './entities/device.entity';
import { GroupsRepository } from './repositories/groups/groups.repository';
import { DevicesRepository } from './repositories/devices/devices.repository';
import { HeartbeatEntity } from './entities/heartbeat.entity';
import { DeviceLatestHeartbeatView } from './views/device-latest-heartbeat.view';
import { HeartbeatsRepository } from './repositories/heartbeats/heartbeats.repository';
import { DeviceDataRepository } from './repositories/device-data/device-data.repository';
import { DeviceDataEntity } from './entities/device-data.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([GroupEntity, DeviceEntity, HeartbeatEntity, DeviceDataEntity, DeviceLatestHeartbeatView]),
  ],
  providers: [GroupsRepository, DevicesRepository, HeartbeatsRepository, DeviceDataRepository],
  exports: [TypeOrmModule, GroupsRepository, DevicesRepository, HeartbeatsRepository, DeviceDataRepository],
})
export class DatabaseModule {}

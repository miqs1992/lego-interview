import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from '../../config/configuration/configuration.service';
import { typeOrmConfig } from './typeorm.config';
import { GroupEntity } from './entities/group.entity';
import { DeviceEntity } from './entities/device.entity';
import { GroupsRepository } from './repositories/groups/groups.repository';
import { DevicesRepository } from "./repositories/devices/devices.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([GroupEntity, DeviceEntity]),
  ],
  providers: [GroupsRepository, DevicesRepository],
  exports: [TypeOrmModule, GroupsRepository, DevicesRepository],
})
export class DatabaseModule {}

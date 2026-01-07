import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeviceEntity } from '../../entities/device.entity';
import { CreateDeviceDto, ListDevicesPayload } from '../../dtos/device.dto';
import { GroupEntity } from '../../entities/group.entity';
import { DeviceLatestHeartbeatView } from '../../views/device-latest-heartbeat.view';

@Injectable()
export class DevicesRepository extends Repository<DeviceEntity> {
  constructor(private dataSource: DataSource) {
    super(DeviceEntity, dataSource.createEntityManager());
  }

  findByMacAddress(macAddress: string): Promise<DeviceEntity | null> {
    return this.findOne({ where: { macAddress } });
  }

  async listDevicesWithLatestHeartbeat(payload: ListDevicesPayload): Promise<{ devices: DeviceEntity[]; total: number }> {
    const { page = 1, limit = 10, groupId } = payload;

    const queryBuilder = this.createQueryBuilder('device')
      .leftJoinAndSelect('device.group', 'group')
      .leftJoinAndMapOne(
        'device.latestHeartbeat',
        DeviceLatestHeartbeatView,
        'latestHeartbeat',
        'latestHeartbeat.deviceId = device.id',
      );

    if (groupId) {
      queryBuilder.where('device.group_id = :groupId', { groupId });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('device.name', 'ASC');

    const [devices, total] = await queryBuilder.getManyAndCount();

    return { devices, total };
  }

  async createDevice(payload: CreateDeviceDto): Promise<DeviceEntity> {
    const existing = await this.findByMacAddress(payload.macAddress);
    if (existing) {
      throw new ConflictException(`Device with Mac Address "${payload.macAddress}" already exists`);
    }

    const groupRepo = this.dataSource.getRepository(GroupEntity);
    const group = await groupRepo.findOne({ where: { id: payload.groupId } });
    if (!group) {
      throw new ConflictException(`Group with ID "${payload.groupId}" does not exist`);
    }

    const device = this.create({
      name: payload.name,
      macAddress: payload.macAddress,
      group: { id: payload.groupId } as GroupEntity,
    });
    return this.save(device);
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeviceEntity } from '../../entities/device.entity';
import { CreateDeviceDto } from "../../dtos/device.dto";
import { GroupEntity } from "../../entities/group.entity";

@Injectable()
export class DevicesRepository extends Repository<DeviceEntity> {
  constructor(private dataSource: DataSource) {
    super(DeviceEntity, dataSource.createEntityManager());
  }

  findByMacAddress(macAddress: string): Promise<DeviceEntity | null> {
    return this.findOne({ where: { macAddress } });
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

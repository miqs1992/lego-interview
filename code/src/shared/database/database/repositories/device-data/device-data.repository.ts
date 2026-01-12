import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeviceEntity } from '../../entities/device.entity';
import { DeviceDataEntity } from '../../entities/device-data.entity';

@Injectable()
export class DeviceDataRepository extends Repository<DeviceDataEntity> {
  constructor(private dataSource: DataSource) {
    super(DeviceDataEntity, dataSource.createEntityManager());
  }

  async createDeviceData(deviceId: string, data: Record<string, any>): Promise<DeviceDataEntity> {
    const deviceRepo = this.dataSource.getRepository(DeviceEntity);
    const device = await deviceRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new ConflictException(`Device with ID "${deviceId}" does not exist`);
    }

    const deviceData = this.create({
      device,
      data,
    });
    return this.save(deviceData);
  }
}

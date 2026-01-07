import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HeartbeatEntity } from '../../entities/heartbeat.entity';
import { DeviceEntity } from '../../entities/device.entity';

@Injectable()
export class HeartbeatsRepository extends Repository<HeartbeatEntity> {
  constructor(private dataSource: DataSource) {
    super(HeartbeatEntity, dataSource.createEntityManager());
  }

  async createHeartbeat(deviceId: string, imageName: string): Promise<HeartbeatEntity> {
    const deviceRepo = this.dataSource.getRepository(DeviceEntity);
    const device = await deviceRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new ConflictException(`Device with ID "${deviceId}" does not exist`);
    }

    const heartbeat = this.create({
      device,
      imageName,
    });
    return this.save(heartbeat);
  }
}

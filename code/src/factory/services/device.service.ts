import { Injectable, NotFoundException } from '@nestjs/common';
import { DevicesRepository } from '../../shared/database/database/repositories/devices/devices.repository';
import { DeviceLatestHeartbeatView } from '../../shared/database/database/views/device-latest-heartbeat.view';
import { DeviceStatus } from '../../shared/database/database/enums/device-status.enum';
import { QueueService } from '../../shared/queue/queue.service';
import { QueuePattern } from '../../shared/queue/queue.pattern';
import { DeviceWithStatusData, ListDevicesResult } from '../device.types';
import { HeartbeatsRepository } from '../../shared/database/database/repositories/heartbeats/heartbeats.repository';
import { CreateDeviceDto } from '../dtos/create-device.dto';
import { differenceInMinutes } from 'date-fns';

const DEVICE_OFFLINE_THRESHOLD_MIN = 10;

@Injectable()
export class DeviceService {
  constructor(
    private devicesRepository: DevicesRepository,
    private heartbeatsRepository: HeartbeatsRepository,
    private queueService: QueueService,
  ) {}

  async listDevices(page: number, limit: number): Promise<ListDevicesResult> {
    const { devices, total } = await this.devicesRepository.listDevicesWithLatestHeartbeat({ page, limit });

    return {
      total,
      devices: devices.map((device) => ({
        id: device.id,
        name: device.name,
        macAddress: device.macAddress,
        createdAt: device.createdAt,
        dataType: device.dataType,
        latestHeartbeatAt: device.latestHeartbeat?.createdAt || null,
        group: device.group.name,
        status: this.isDeviceOnline(device.latestHeartbeat) ? DeviceStatus.ONLINE : DeviceStatus.OFFLINE,
      })),
    };
  }

  async restartDevice(deviceId: string) {
    const device = await this.devicesRepository.findOne({ where: { id: deviceId } });

    if (!device) {
      throw new NotFoundException(`Device with ID "${deviceId}" not found`);
    }

    this.queueService.emitMessage(QueuePattern.DEVICE_REBOOT, deviceId, {});
  }

  async processHeartbeat(deviceId: string, imageName: string) {
    const device = await this.devicesRepository.findOne({ where: { id: deviceId } });

    if (!device) {
      throw new NotFoundException(`Device with ID "${deviceId}" not found`);
    }

    return this.heartbeatsRepository.createHeartbeat(deviceId, imageName);
  }

  async createDevice(payload: CreateDeviceDto): Promise<DeviceWithStatusData> {
    const newDevice = await this.devicesRepository.createDevice(payload);

    return {
      id: newDevice.id,
      name: newDevice.name,
      macAddress: newDevice.macAddress,
      createdAt: newDevice.createdAt,
      dataType: newDevice.dataType,
      latestHeartbeatAt: null,
      group: newDevice.group.name,
      status: DeviceStatus.OFFLINE,
    };
  }

  private isDeviceOnline(latestHeartbeat: DeviceLatestHeartbeatView | undefined): boolean {
    if (!latestHeartbeat) {
      return false;
    }

    const diffInMinutes = differenceInMinutes(new Date(), latestHeartbeat.createdAt);

    return diffInMinutes <= DEVICE_OFFLINE_THRESHOLD_MIN;
  }
}

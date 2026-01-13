import { DeviceEntity } from '../entities/device.entity';

export interface CreateDeviceDto {
  name: string;
  macAddress: string;
  groupId: string;
  dataType?: string;
}

export interface ListDevicesPayload {
  page?: number;
  limit?: number;
  groupId?: string;
}

export interface DevicesListResult {
  devices: DeviceEntity[];
  total: number;
}

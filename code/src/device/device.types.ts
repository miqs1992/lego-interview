import { DeviceStatus } from '../shared/database/database/enums/device-status.enum';

export interface ListDevicesResult {
  total: number;
  devices: {
    id: string;
    name: string;
    createdAt: Date;
    latestHeartbeatAt: Date | null;
    group: string;
    status: DeviceStatus;
  }[];
}

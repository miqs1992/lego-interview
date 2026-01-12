import { DeviceStatus } from '../shared/database/database/enums/device-status.enum';
import { DeviceDataType } from '../shared/database/database/enums/device-data-type.enum';

export interface ListDevicesResult {
  total: number;
  devices: DeviceWithStatusData[];
}

export interface DeviceWithStatusData {
  id: string;
  name: string;
  macAddress: string;
  createdAt: Date;
  dataType: DeviceDataType | null;
  latestHeartbeatAt: Date | null;
  group: string;
  status: DeviceStatus;
}

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

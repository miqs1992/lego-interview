export interface CreateDeviceDto {
  name: string;
  macAddress: string;
  groupId: string;
}

export interface ListDevicesPayload {
  page?: number;
  limit?: number;
  groupId?: string;
}

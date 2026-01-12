import { ConflictException } from '@nestjs/common';

export enum DeviceDataType {
  THERMOMETER = 'THERMOMETER',
  PRESSURE_SENSOR = 'PRESSURE_SENSOR',
  COLOR_QUALITY_SENSOR = 'COLOR_QUALITY_SENSOR',
}

export const parseDeviceDataType = (value: string | undefined | null): DeviceDataType | null => {
  if (!value) {
    return null;
  }

  switch (value as DeviceDataType) {
    case DeviceDataType.THERMOMETER:
      return DeviceDataType.THERMOMETER;
    case DeviceDataType.PRESSURE_SENSOR:
      return DeviceDataType.PRESSURE_SENSOR;
    case DeviceDataType.COLOR_QUALITY_SENSOR:
      return DeviceDataType.COLOR_QUALITY_SENSOR;
    default:
      throw new ConflictException(`Invalid DeviceDataType: ${value}`);
  }
};

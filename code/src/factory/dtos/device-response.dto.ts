import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceStatus } from '../../shared/database/database/enums/device-status.enum';
import { DeviceWithStatusData, ListDevicesResult } from '../device.types';
import { DeviceDataType } from '../../shared/database/database/enums/device-data-type.enum';

export class DeviceResponseDto implements DeviceWithStatusData {
  @ApiProperty({
    description: 'Unique identifier of the device',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the device',
    example: 'Temperature Sensor 1',
  })
  name: string;

  @ApiProperty({
    description: 'MAC address of the device',
    example: '00:1A:2B:3C:4D:5E',
  })
  macAddress: string;

  @ApiProperty({
    description: 'Date when the device was created',
    example: '2026-01-08T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Date of the latest heartbeat received from the device',
    example: '2026-01-08T12:05:00.000Z',
    nullable: true,
  })
  latestHeartbeatAt: Date | null;

  @ApiProperty({
    description: 'Name of the group this device belongs to',
    example: 'Molding',
  })
  group: string;

  @ApiProperty({
    description: 'Current status of the device',
    enum: DeviceStatus,
    example: DeviceStatus.ONLINE,
  })
  status: DeviceStatus;

  @ApiPropertyOptional({
    description: 'Data type of the device',
    example: DeviceDataType.THERMOMETER,
    nullable: true,
  })
  dataType: DeviceDataType | null;
}

export class ListDevicesResponseDto implements ListDevicesResult {
  @ApiProperty({
    description: 'Total number of devices',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'List of devices',
    type: [DeviceResponseDto],
  })
  devices: DeviceResponseDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;
}

export class RestartDeviceResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example: 'Restart command sent to device 550e8400-e29b-41d4-a716-446655440000',
  })
  message: string;
}

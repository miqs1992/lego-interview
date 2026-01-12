import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMACAddress, IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { CreateDeviceDto as DatabaseCreateDeviceDto } from '../../shared/database/database/dtos/device.dto';
import { DeviceDataType } from '../../shared/database/database/enums/device-data-type.enum';

export class CreateDeviceDto implements DatabaseCreateDeviceDto {
  @ApiProperty({
    description: 'The name of the device',
    example: 'Temperature Sensor 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The UUID of the group this device belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({
    description: 'The MAC address of the device',
    example: '00:1A:2B:3C:4D:5E',
  })
  @IsMACAddress()
  @IsNotEmpty()
  macAddress: string;

  @ApiPropertyOptional({
    description: 'The data type of the device',
    enum: DeviceDataType,
    example: DeviceDataType.THERMOMETER,
  })
  @IsEnum(DeviceDataType)
  @IsOptional()
  dataType?: DeviceDataType;
}

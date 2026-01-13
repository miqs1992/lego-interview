import { Body, Controller, Get, Logger, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { DeviceService } from '../services/device.service';
import { CreateDeviceDto } from '../dtos/create-device.dto';
import { DeviceResponseDto, ListDevicesResponseDto, RestartDeviceResponseDto } from '../dtos/device-response.dto';
import { DataService } from '../services/data.service';

@Controller('devices')
export class DeviceController {
  private readonly logger: Logger = new Logger(DeviceController.name);

  constructor(
    private readonly deviceService: DeviceService,
    private readonly dataService: DataService,
  ) {}

  @ApiOkResponse({
    description: 'List of devices with pagination',
    type: ListDevicesResponseDto,
  })
  @Get('/')
  async listDevices(@Query() { page, limit }: PaginationDto) {
    this.logger.log(`Listing devices - Page: ${page}, Limit: ${limit}`);

    const { devices, total } = await this.deviceService.listDevices(page, limit);

    return { devices, total, page, limit };
  }

  @ApiCreatedResponse({
    description: 'The device has been successfully created',
    type: DeviceResponseDto,
  })
  @Post('/')
  createDevice(@Body() createDeviceDto: CreateDeviceDto) {
    this.logger.log(`Create device endpoint called`);

    return this.deviceService.createDevice(createDeviceDto);
  }

  @ApiOkResponse({
    description: 'Restart command sent successfully',
    type: RestartDeviceResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Device not found',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the device to restart',
    type: 'string',
    format: 'uuid',
  })
  @Post('/:id/restart')
  async restartDevice(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Restart command sent to device ${id}`);

    await this.deviceService.restartDevice(id);

    return { message: `Restart command sent to device ${id}` };
  }

  @ApiParam({
    name: 'id',
    description: 'The UUID of the device',
    type: 'string',
    format: 'uuid',
  })
  @Get('/:id/data')
  async getDeviceData(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching data for device ${id}`);

    return this.dataService.getDeviceData(id);
  }
}

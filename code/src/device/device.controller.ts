import { Controller, Get, Logger, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { DeviceService } from './device.service';

@Controller('devices')
export class DeviceController {
  private readonly logger: Logger = new Logger(DeviceController.name);

  constructor(private readonly deviceService: DeviceService) {}

  @Get('/')
  async listDevices(@Query() { page, limit }: PaginationDto) {
    this.logger.log(`Listing devices - Page: ${page}, Limit: ${limit}`);

    const { devices, total } = await this.deviceService.listDevices(page, limit);

    return { devices, total, page, limit };
  }

  @Post('/:id/restart')
  async restartDevice(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Restart command sent to device ${id}`);

    await this.deviceService.restartDevice(id);

    return { message: `Restart command sent to device ${id}` };
  }
}

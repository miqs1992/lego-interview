import { Controller, Get, Logger, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueueService } from '../../shared/queue/queue.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { QueuePattern } from '../../shared/queue/queue.pattern';
import { ThermometerData } from '../services/data-validators/thermometer.dto';
import { ColorQualityData } from '../services/data-validators/color-quality.dto';

@Controller('fake-devices')
@ApiTags('Fake Devices')
export class FakeDeviceController {
  private readonly logger: Logger = new Logger(FakeDeviceController.name);

  constructor(private queueService: QueueService) {}

  @ApiParam({
    name: 'id',
    description: 'The UUID of the device',
    type: 'string',
    format: 'uuid',
  })
  @Get('/:id/heartbeat')
  testEmit(@Param('id', ParseUUIDPipe) id: string) {
    this.queueService.emitMessage(QueuePattern.DEVICE_HEARTBEAT, id, {});
    const message = `Emitted heartbeat for device ${id}`;
    this.logger.log(message);
    return { message };
  }

  @ApiParam({
    name: 'id',
    description: 'The UUID of the device',
    type: 'string',
    format: 'uuid',
  })
  @Get('/:id/thermometer')
  testThermometer(@Param('id', ParseUUIDPipe) id: string) {
    const data = {
      temperature: Math.round((20 + Math.random() * 10) * 10) / 10,
      humidity: Math.floor(Math.random() * 100),
    };
    this.queueService.emitMessage<ThermometerData>(QueuePattern.DEVICE_DATA, id, data);
    const message = `Emitted thermometer data for device ${id}`;
    this.logger.log(message);
    return { message, data };
  }

  @ApiParam({
    name: 'id',
    description: 'The UUID of the device',
    type: 'string',
    format: 'uuid',
  })
  @Get(':id/color-quality')
  testColorQuality(@Param('id', ParseUUIDPipe) id: string) {
    const data: ColorQualityData = {
      detectedColor: '#ff5733',
      colorAccuracy: Math.round((80 + Math.random() * 20) * 10) / 10,
      brightness: Math.floor(Math.random() * 100),
    };
    this.queueService.emitMessage<ColorQualityData>(QueuePattern.DEVICE_DATA, id, data);
    const message = `Emitted color quality data for device ${id}`;
    this.logger.log(message);
    return { message, data };
  }

  @ApiParam({
    name: 'id',
    description: 'The UUID of the device',
    type: 'string',
    format: 'uuid',
  })
  @Get(':id/invalid-data')
  testInvalidData(@Param('id', ParseUUIDPipe) id: string) {
    const data = {
      invalidField1: 'some string',
      invalidField2: 12345,
    };
    this.queueService.emitMessage(QueuePattern.DEVICE_DATA, id, data);
    const message = `Emitted invalid data for device ${id}`;
    this.logger.log(message);
    return { message, data };
  }
}

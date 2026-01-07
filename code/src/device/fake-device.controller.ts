import { Controller, Get, Logger, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueueService } from '../shared/queue/queue.service';
import { ApiTags } from '@nestjs/swagger';
import { QueuePattern } from '../shared/queue/queue.pattern';

@Controller('fake-devices')
@ApiTags('Fake Devices')
export class FakeDeviceController {
  private readonly logger: Logger = new Logger(FakeDeviceController.name);

  constructor(private queueService: QueueService) {}

  @Get('/test-emit/:id')
  testEmit(@Param('id', ParseUUIDPipe) id: string) {
    this.queueService.emitMessage(QueuePattern.DEVICE_HEARTBEAT, id, {});
    const message = `Emitted test message for device ${id}`;
    this.logger.log(message);
    return { message };
  }
}

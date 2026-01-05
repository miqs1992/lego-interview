import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from "@nestjs/microservices";
import { QueueService } from "../shared/queue/queue.service";

@Controller('devices')
export class DeviceController {
  private readonly logger: Logger = new Logger(DeviceController.name);

  constructor(
    private queueService: QueueService,
  ) {}

  @EventPattern('/devices/+/connection')
  handle(
    @Payload() data: { status: 'online' | 'offline' },
    @Ctx() ctx: MqttContext,
  ) {
    const deviceId = ctx.getTopic().split('/')[2];

    this.logger.log(`Device ${deviceId} is now ${data.status}`);
  }

  @Get('/test-emit')
  async testEmit() {
    const testDeviceId = 'test-device-123';
    await this.queueService.emitMessage(testDeviceId);
    return { message: `Emitted test message for device ${testDeviceId}` };
  }
}

import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext } from '@nestjs/microservices';
import { QueuePattern } from '../../shared/queue/queue.pattern';
import { DeviceService } from '../services/device.service';

@Controller('devices-listener')
export class DeviceListenerController {
  private readonly logger: Logger = new Logger(DeviceListenerController.name);

  constructor(private readonly deviceService: DeviceService) {}

  @EventPattern(QueuePattern.DEVICE_HEARTBEAT)
  async processHeartbeat(@Ctx() ctx: MqttContext) {
    const deviceId = ctx.getTopic().split('/')[1];

    await this.deviceService.processHeartbeat(deviceId, 'test-image:latest');

    this.logger.log(`Processed heartbeat from device ${deviceId}`);
  }
}

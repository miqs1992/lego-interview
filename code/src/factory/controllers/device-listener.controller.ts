import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { QueuePattern } from '../../shared/queue/queue.pattern';
import { DeviceService } from '../services/device.service';
import { DataService } from '../services/data.service';

@Controller('devices-listener')
export class DeviceListenerController {
  private readonly logger: Logger = new Logger(DeviceListenerController.name);

  constructor(
    private readonly deviceService: DeviceService,
    private readonly dataService: DataService,
  ) {}

  @EventPattern(QueuePattern.DEVICE_HEARTBEAT)
  async processHeartbeat(@Ctx() ctx: MqttContext) {
    const deviceId = ctx.getTopic().split('/')[1];

    await this.deviceService.processHeartbeat(deviceId, 'test-image:latest');

    this.logger.log(`Processed heartbeat from device ${deviceId}`);
  }

  @EventPattern(QueuePattern.DEVICE_DATA)
  async processDeviceData(@Ctx() ctx: MqttContext, @Payload() payload: any) {
    const deviceId = ctx.getTopic().split('/')[1];

    await this.dataService.processDeviceData(deviceId, payload as Record<string, any>);

    this.logger.log(`Processed data from device ${deviceId}: ${JSON.stringify(payload)}`);
  }
}

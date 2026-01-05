import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import { MQTT_CLIENT } from "./mqtt.config";

@Injectable()
export class QueueService {
  constructor(
    @Inject(MQTT_CLIENT)
    private readonly mqttClient: ClientProxy,
  ) {}

  async emitMessage(deviceId: string) {
    return this.mqttClient.emit(`devices/${deviceId}/connection`, {
      status: 'online',
    });
  }
}

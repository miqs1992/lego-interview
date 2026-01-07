import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_CLIENT } from './mqtt.config';
import { QueuePattern, setPatternIdentifier } from './queue.pattern';

@Injectable()
export class QueueService {
  constructor(
    @Inject(MQTT_CLIENT)
    private readonly mqttClient: ClientProxy,
  ) {}

  emitMessage<T = never>(pattern: QueuePattern, identifier: string, payload: T) {
    return this.mqttClient.emit(setPatternIdentifier(pattern, identifier), payload);
  }
}

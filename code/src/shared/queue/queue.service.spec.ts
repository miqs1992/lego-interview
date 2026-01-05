import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { ClientProxy } from "@nestjs/microservices";
import { MQTT_CLIENT } from "./mqtt.config";
import { createMqttMock } from "./mqtt.mock";

describe('QueueService', () => {
  let service: QueueService;
  let mqttClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        createMqttMock(),
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    mqttClient = module.get<ClientProxy>(MQTT_CLIENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a device connection message', () => {
    service.emitMessage('123');

    expect(mqttClient.emit).toHaveBeenCalledWith(
      'devices/123/connection',
      { status: 'online' },
    );
  });
});

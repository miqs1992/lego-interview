import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_CLIENT } from './mqtt.config';
import { createMqttMock } from './mqtt.mock';
import { QueuePattern } from './queue.pattern';

describe('QueueService', () => {
  let service: QueueService;
  let mqttClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService, createMqttMock()],
    }).compile();

    service = module.get<QueueService>(QueueService);
    mqttClient = module.get<ClientProxy>(MQTT_CLIENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emitMessage', () => {
    it('should send a device connection message', () => {
      const emitSpy = jest.spyOn(mqttClient, 'emit');

      service.emitMessage(QueuePattern.DEVICE_HEARTBEAT, '123', { status: 'online' });

      expect(emitSpy).toHaveBeenCalledWith('devices/123/connection', {
        status: 'online',
      });
    });
  });
});

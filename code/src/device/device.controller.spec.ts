import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { QueueService } from "../shared/queue/queue.service";
import { createMqttMock } from "../shared/queue/mqtt.mock";

describe('DeviceController', () => {
  let controller: DeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        QueueService,
        createMqttMock(),
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

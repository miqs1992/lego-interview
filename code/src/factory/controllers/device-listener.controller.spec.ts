import { DeviceService } from '../services/device.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeviceListenerController } from './device-listener.controller';
import { createMqttContextMock } from '../../shared/queue/mqtt.mock';

describe('DeviceListenerController', () => {
  let controller: DeviceListenerController;

  const deviceServiceMock: Partial<jest.Mocked<DeviceService>> = {
    processHeartbeat: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceListenerController],
      providers: [{ provide: DeviceService, useValue: deviceServiceMock }],
    }).compile();

    controller = module.get<DeviceListenerController>(DeviceListenerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('.processHeartbeat', () => {
    it('should call deviceService.processHeartbeat', async () => {
      const ctxMock = createMqttContextMock('devices/device123/heartbeat');
      await controller.processHeartbeat(ctxMock);
      expect(deviceServiceMock.processHeartbeat).toHaveBeenCalledWith('device123', 'test-image:latest');
    });
  });
});

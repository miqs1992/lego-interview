import { DeviceService } from '../services/device.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeviceListenerController } from './device-listener.controller';
import { createMqttContextMock } from '../../shared/queue/mqtt.mock';
import { DataService } from '../services/data.service';

describe('DeviceListenerController', () => {
  let controller: DeviceListenerController;

  const deviceServiceMock: Partial<jest.Mocked<DeviceService>> = {
    processHeartbeat: jest.fn(),
  };

  const dataServiceMock: Partial<jest.Mocked<DataService>> = {
    processDeviceData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceListenerController],
      providers: [
        { provide: DeviceService, useValue: deviceServiceMock },
        { provide: DataService, useValue: dataServiceMock },
      ],
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

  describe('.processDeviceData', () => {
    it('should call dataService.processDeviceData', async () => {
      const ctxMock = createMqttContextMock('devices/device123/data');
      const payload = { temperature: 25.5, humidity: 70 };
      await controller.processDeviceData(ctxMock, payload);
      expect(dataServiceMock.processDeviceData).toHaveBeenCalledWith('device123', payload);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { ListDevicesResult } from './device.types';

describe('DeviceController', () => {
  let controller: DeviceController;

  const deviceServiceMock: Partial<jest.Mocked<DeviceService>> = {
    listDevices: jest.fn(),
    restartDevice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [{ provide: DeviceService, useValue: deviceServiceMock }],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('.listDevices', () => {
    it('should return paginated list of devices', async () => {
      deviceServiceMock.listDevices!.mockResolvedValue({
        devices: [{ id: 'device1' } as ListDevicesResult['devices'][0]],
        total: 1,
      });

      const result = await controller.listDevices({ page: 1, limit: 10 });
      expect(result).toEqual({
        devices: [{ id: 'device1' }],
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('.restartDevice', () => {
    it('should call deviceService.restartDevice', async () => {
      await controller.restartDevice('device123');
      expect(deviceServiceMock.restartDevice).toHaveBeenCalledWith('device123');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { QueueService } from '../shared/queue/queue.service';
import { DevicesRepository } from '../shared/database/database/repositories/devices/devices.repository';
import { HeartbeatsRepository } from '../shared/database/database/repositories/heartbeats/heartbeats.repository';
import { QueuePattern } from '../shared/queue/queue.pattern';
import { DeviceEntity } from '../shared/database/database/entities/device.entity';
import { DeviceStatus } from '../shared/database/database/enums/device-status.enum';
import { subMinutes } from 'date-fns';

describe('DeviceService', () => {
  let service: DeviceService;

  const devicesRepositoryMock: Partial<jest.Mocked<DevicesRepository>> = {
    findOne: jest.fn(),
    listDevicesWithLatestHeartbeat: jest.fn(),
  };

  const heartbeatsRepositoryMock: Partial<jest.Mocked<HeartbeatsRepository>> = {
    createHeartbeat: jest.fn(),
  };

  const queueServiceMock: Partial<jest.Mocked<QueueService>> = {
    emitMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: DevicesRepository,
          useValue: devicesRepositoryMock,
        },
        {
          provide: HeartbeatsRepository,
          useValue: heartbeatsRepositoryMock,
        },
        {
          provide: QueueService,
          useValue: queueServiceMock,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.restartDevice', () => {
    it('should emit a device reboot message', async () => {
      devicesRepositoryMock.findOne!.mockResolvedValue({ id: 'device123' } as DeviceEntity);

      await service.restartDevice('device123');

      expect(queueServiceMock.emitMessage).toHaveBeenCalledWith(QueuePattern.DEVICE_REBOOT, 'device123', {});
    });

    it('should throw NotFoundException if device does not exist', async () => {
      devicesRepositoryMock.findOne!.mockResolvedValue(null);

      await expect(service.restartDevice('nonexistentDevice')).rejects.toThrow('Device with ID "nonexistentDevice" not found');
    });
  });

  describe('.listDevices', () => {
    it('should return device with ONLINE status when heartbeat is within 10 minutes', async () => {
      const now = new Date();
      const mockDevice: DeviceEntity = {
        id: 'device-1',
        name: 'Test Device',
        macAddress: '00:00:00:00:00:01',
        createdAt: new Date('2025-01-01'),
        group: { id: 'group-1', name: 'Group A', devices: [], createdAt: new Date('2025-01-01') },
        heartbeats: [],
        latestHeartbeat: {
          id: 'heartbeat-1',
          deviceId: 'device-1',
          imageName: 'image-v1',
          createdAt: subMinutes(now, 5), // 5 minutes ago - should be online
        },
      };

      devicesRepositoryMock.listDevicesWithLatestHeartbeat!.mockResolvedValue({
        devices: [mockDevice],
        total: 1,
      });

      const result = await service.listDevices(1, 10);

      expect(result.total).toBe(1);
      expect(result.devices[0]).toEqual({
        id: mockDevice.id,
        name: mockDevice.name,
        createdAt: mockDevice.createdAt,
        latestHeartbeatAt: mockDevice.latestHeartbeat!.createdAt,
        group: mockDevice.group.name,
        status: DeviceStatus.ONLINE,
      });
    });

    it('should return device with OFFLINE status when heartbeat is older than 10 minutes', async () => {
      const now = new Date();
      const mockDevice: DeviceEntity = {
        id: 'device-2',
        name: 'Offline Device',
        macAddress: '00:00:00:00:00:02',
        createdAt: new Date('2025-01-01'),
        group: { id: 'group-2', name: 'Group B', devices: [], createdAt: new Date('2025-01-01') },
        heartbeats: [],
        latestHeartbeat: {
          id: 'heartbeat-2',
          deviceId: 'device-2',
          imageName: 'image-v1',
          createdAt: subMinutes(now, 15),
        },
      };

      devicesRepositoryMock.listDevicesWithLatestHeartbeat!.mockResolvedValue({
        devices: [mockDevice],
        total: 1,
      });

      const result = await service.listDevices(1, 10);

      expect(result.total).toBe(1);
      expect(result.devices[0]).toEqual({
        id: mockDevice.id,
        name: mockDevice.name,
        createdAt: mockDevice.createdAt,
        latestHeartbeatAt: mockDevice.latestHeartbeat!.createdAt,
        group: mockDevice.group.name,
        status: DeviceStatus.OFFLINE,
      });
    });

    it('should return device with OFFLINE status when there is no heartbeat', async () => {
      const mockDevice: DeviceEntity = {
        id: 'device-3',
        name: 'No Heartbeat Device',
        macAddress: '00:00:00:00:00:03',
        createdAt: new Date('2025-01-01'),
        group: { id: 'group-3', name: 'Group C', devices: [], createdAt: new Date('2025-01-01') },
        heartbeats: [],
        latestHeartbeat: undefined,
      };

      devicesRepositoryMock.listDevicesWithLatestHeartbeat!.mockResolvedValue({
        devices: [mockDevice],
        total: 1,
      });

      const result = await service.listDevices(1, 10);

      expect(result.total).toBe(1);
      expect(result.devices[0]).toEqual({
        id: mockDevice.id,
        name: mockDevice.name,
        createdAt: mockDevice.createdAt,
        latestHeartbeatAt: null,
        group: mockDevice.group.name,
        status: DeviceStatus.OFFLINE,
      });
    });
  });
});

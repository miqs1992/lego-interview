import { DevicesRepository } from './devices.repository';
import { GroupsRepository } from '../groups/groups.repository';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigurationModule } from '../../../../config/configuration';
import { DatabaseModule } from '../../database.module';
import { CreateDeviceDto } from '../../dtos/device.dto';
import { HeartbeatsRepository } from '../heartbeats/heartbeats.repository';

describe('DevicesRepository', () => {
  let repository: DevicesRepository;
  let groupsRepository: GroupsRepository;
  let heartbeatsRepository: HeartbeatsRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigurationModule, DatabaseModule],
      providers: [DevicesRepository, GroupsRepository],
    }).compile();

    repository = moduleRef.get<DevicesRepository>(DevicesRepository);
    groupsRepository = moduleRef.get<GroupsRepository>(GroupsRepository);
    heartbeatsRepository = moduleRef.get<HeartbeatsRepository>(HeartbeatsRepository);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('.createDevice', () => {
    it('creates a device', async () => {
      const group = await groupsRepository.createGroup('Device Test Group');
      const payload: CreateDeviceDto = {
        name: 'Test Device',
        macAddress: '00:11:22:33:44:55',
        groupId: group.id,
      };
      const device = await repository.createDevice(payload);
      expect(device).toBeDefined();
      expect(device.id).toBeDefined();
      expect(device.name).toBe('Test Device');
      expect(device.macAddress).toBe('00:11:22:33:44:55');
      expect(device.group.name).toBe(group.name);
    });

    it('throws if device exists', async () => {
      const group = await groupsRepository.createGroup('Duplicate Device Group');
      const payload: CreateDeviceDto = {
        name: 'Duplicate Device',
        macAddress: 'AA:BB:CC:DD:EE:FF',
        groupId: group.id,
      };
      await repository.createDevice(payload);
      await expect(repository.createDevice(payload)).rejects.toThrow(
        'Device with Mac Address "AA:BB:CC:DD:EE:FF" already exists',
      );
    });

    it('throws if group does not exist', async () => {
      const payload: CreateDeviceDto = {
        name: 'Orphan Device',
        macAddress: '12:34:56:78:90:AB',
        groupId: '6c389839-ff70-438c-88af-9cd9d93d32d6', // Non-existent group ID
      };
      await expect(repository.createDevice(payload)).rejects.toThrow(`Group with ID "${payload.groupId}" does not exist`);
    });
  });

  describe('.findByMacAddress', () => {
    it('finds a device by mac address', async () => {
      const group = await groupsRepository.createGroup('Find Device Group');
      const payload: CreateDeviceDto = {
        name: 'Find Me',
        macAddress: '11:22:33:44:55:66',
        groupId: group.id,
      };
      await repository.createDevice(payload);

      const found = await repository.findByMacAddress('11:22:33:44:55:66');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Find Me');
    });

    it('returns null if not found', async () => {
      const found = await repository.findByMacAddress('FF:FF:FF:FF:FF:FF');
      expect(found).toBeNull();
    });
  });

  describe('.listDevicesWithLatestHeartbeat', () => {
    it('lists devices with pagination', async () => {
      const group = await groupsRepository.createGroup('Pagination Device Group');

      for (let i = 0; i < 15; i++) {
        await repository.createDevice({
          name: `Device ${(i + 1).toString().padStart(3, '0')}`,
          macAddress: `00:00:00:00:00:${(i + 1).toString().padStart(2, '0')}`,
          groupId: group.id,
        });
      }

      const { devices, total } = await repository.listDevicesWithLatestHeartbeat({ page: 2, limit: 5 });

      expect(total).toBe(15);
      expect(devices.length).toBe(5);
      expect(devices[0].name).toBe('Device 006');
    });

    it('filters devices by groupId', async () => {
      const groupA = await groupsRepository.createGroup('Group A');
      const groupB = await groupsRepository.createGroup('Group B');

      await repository.createDevice({
        name: 'Device A1',
        macAddress: 'AA:AA:AA:AA:AA:01',
        groupId: groupA.id,
      });
      await repository.createDevice({
        name: 'Device B1',
        macAddress: 'BB:BB:BB:BB:BB:01',
        groupId: groupB.id,
      });

      const { devices, total } = await repository.listDevicesWithLatestHeartbeat({ groupId: groupA.id });

      expect(total).toBe(1);
      expect(devices.length).toBe(1);
      expect(devices[0].name).toBe('Device A1');
    });

    it('should returns only latest heartbeat for each device', async () => {
      const group = await groupsRepository.createGroup('Heartbeat Test Group');

      const device = await repository.createDevice({
        name: 'Heartbeat Device',
        macAddress: 'CC:CC:CC:CC:CC:01',
        groupId: group.id,
      });

      for (let i = 0; i < 3; i++) {
        await heartbeatsRepository.createHeartbeat(device.id, `image version ${i + 1}`);
      }

      const { devices } = await repository.listDevicesWithLatestHeartbeat({});

      expect(devices[0].latestHeartbeat).toBeDefined();
      expect(devices[0].latestHeartbeat!.deviceId).toBe(device.id);
      expect(devices[0].latestHeartbeat!.imageName).toBe('image version 3');
    });
  });
});

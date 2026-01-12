import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigurationModule } from '../../../../config/configuration';
import { DatabaseModule } from '../../database.module';
import { DevicesRepository } from '../devices/devices.repository';
import { GroupsRepository } from '../groups/groups.repository';
import { ConflictException } from '@nestjs/common';
import { DeviceDataRepository } from './device-data.repository';

describe('DeviceDataRepository', () => {
  let repository: DeviceDataRepository;
  let devicesRepository: DevicesRepository;
  let groupsRepository: GroupsRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigurationModule, DatabaseModule],
      providers: [DeviceDataRepository, DevicesRepository, GroupsRepository],
    }).compile();

    repository = moduleRef.get<DeviceDataRepository>(DeviceDataRepository);
    devicesRepository = moduleRef.get<DevicesRepository>(DevicesRepository);
    groupsRepository = moduleRef.get<GroupsRepository>(GroupsRepository);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('.createDeviceData', () => {
    it('creates a device data record for an existing device', async () => {
      const group = await groupsRepository.createGroup('Test Group');
      const device = await devicesRepository.createDevice({
        name: 'Test Device',
        macAddress: 'AA:BB:CC:DD:EE:FF',
        groupId: group.id,
      });
      const data = { temperature: 22.5, humidity: 60 };

      const deviceData = await repository.createDeviceData(device.id, data);

      expect(deviceData).toBeDefined();
      expect(deviceData.id).toBeDefined();
      expect(deviceData.data).toEqual(data);
      expect(deviceData.device.id).toBe(device.id);
    });

    it('throws if device does not exist', async () => {
      const nonExistentDeviceId = '00000000-0000-0000-0000-000000000000';

      await expect(repository.createDeviceData(nonExistentDeviceId, { test: 1 })).rejects.toThrow(ConflictException);
    });
  });
});

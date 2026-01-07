import { HeartbeatsRepository } from './heartbeats.repository';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigurationModule } from '../../../../config/configuration';
import { DatabaseModule } from '../../database.module';
import { DevicesRepository } from '../devices/devices.repository';
import { GroupsRepository } from '../groups/groups.repository';
import { ConflictException } from '@nestjs/common';

describe('HeartbeatsRepository', () => {
  let repository: HeartbeatsRepository;
  let devicesRepository: DevicesRepository;
  let groupsRepository: GroupsRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigurationModule, DatabaseModule],
      providers: [HeartbeatsRepository, DevicesRepository, GroupsRepository],
    }).compile();

    repository = moduleRef.get<HeartbeatsRepository>(HeartbeatsRepository);
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

  describe('.createHeartbeat', () => {
    it('creates a heartbeat for an existing device', async () => {
      const group = await groupsRepository.createGroup('Test Group');
      const device = await devicesRepository.createDevice({
        name: 'Test Device',
        macAddress: 'AA:BB:CC:DD:EE:FF',
        groupId: group.id,
      });

      const heartbeat = await repository.createHeartbeat(device.id, 'test-image:latest');

      expect(heartbeat).toBeDefined();
      expect(heartbeat.id).toBeDefined();
      expect(heartbeat.imageName).toBe('test-image:latest');
      expect(heartbeat.device.id).toBe(device.id);
    });

    it('throws if device does not exist', async () => {
      const nonExistentDeviceId = '00000000-0000-0000-0000-000000000000';

      await expect(repository.createHeartbeat(nonExistentDeviceId, 'test-image:latest')).rejects.toThrow(ConflictException);
    });
  });
});

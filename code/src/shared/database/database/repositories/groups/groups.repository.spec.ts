import { GroupsRepository } from './groups.repository';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ConfigurationModule } from '../../../../config/configuration';
import { DatabaseModule } from '../../database.module';

describe('GroupsRepository', () => {
  let repository: GroupsRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigurationModule, DatabaseModule],
      providers: [GroupsRepository],
    }).compile();

    repository = moduleRef.get<GroupsRepository>(GroupsRepository);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('.createGroup', () => {
    it('creates a group', async () => {
      const group = await repository.createGroup('Test Group');
      expect(group).toBeDefined();
      expect(group.id).toBeDefined();
      expect(group.name).toBe('Test Group');
    });

    it('throws if group exists', async () => {
      await repository.createGroup('Duplicate Group');
      await expect(repository.createGroup('Duplicate Group')).rejects.toThrow();
    });
  });
});

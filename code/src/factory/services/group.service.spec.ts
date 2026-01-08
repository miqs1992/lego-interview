import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { GroupsRepository } from '../../shared/database/database/repositories/groups/groups.repository';
import { GroupEntity } from '../../shared/database/database/entities/group.entity';
import { ConflictException } from '@nestjs/common';

describe('GroupService', () => {
  let service: GroupService;

  const groupsRepositoryMock: Partial<jest.Mocked<GroupsRepository>> = {
    find: jest.fn(),
    createGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: GroupsRepository,
          useValue: groupsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.listGroups', () => {
    it('should return all groups sorted by name', async () => {
      const mockGroups: GroupEntity[] = [
        {
          id: 'group-1',
          name: 'Alpha Group',
          createdAt: new Date('2025-01-01'),
          devices: [],
        },
        {
          id: 'group-2',
          name: 'Beta Group',
          createdAt: new Date('2025-01-02'),
          devices: [],
        },
      ];

      groupsRepositoryMock.find!.mockResolvedValue(mockGroups);

      const result = await service.listGroups();

      expect(groupsRepositoryMock.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
      expect(result.total).toBe(2);
      expect(result.groups).toEqual([
        {
          id: 'group-1',
          name: 'Alpha Group',
          createdAt: mockGroups[0].createdAt,
        },
        {
          id: 'group-2',
          name: 'Beta Group',
          createdAt: mockGroups[1].createdAt,
        },
      ]);
    });

    it('should return empty array when no groups exist', async () => {
      groupsRepositoryMock.find!.mockResolvedValue([]);

      const result = await service.listGroups();

      expect(result.total).toBe(0);
      expect(result.groups).toEqual([]);
    });
  });

  describe('.createGroup', () => {
    it('should create a new group and return it', async () => {
      const mockGroup: GroupEntity = {
        id: 'group-new',
        name: 'New Group',
        createdAt: new Date('2025-01-03'),
        devices: [],
      };

      groupsRepositoryMock.createGroup!.mockResolvedValue(mockGroup);

      const result = await service.createGroup('New Group');

      expect(groupsRepositoryMock.createGroup).toHaveBeenCalledWith('New Group');
      expect(result).toEqual({
        id: mockGroup.id,
        name: mockGroup.name,
        createdAt: mockGroup.createdAt,
      });
    });

    it('should throw ConflictException when group with same name already exists', async () => {
      groupsRepositoryMock.createGroup!.mockRejectedValue(
        new ConflictException('Group with name "Existing Group" already exists'),
      );

      await expect(service.createGroup('Existing Group')).rejects.toThrow(ConflictException);
      await expect(service.createGroup('Existing Group')).rejects.toThrow('Group with name "Existing Group" already exists');
    });
  });
});

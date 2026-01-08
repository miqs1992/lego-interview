import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from '../services/group.service';

describe('GroupController', () => {
  let controller: GroupController;

  const groupServiceMock: Partial<jest.Mocked<GroupService>> = {
    listGroups: jest.fn(),
    createGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [{ provide: GroupService, useValue: groupServiceMock }],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('.listGroups', () => {
    it('should return list of groups', async () => {
      const mockGroups = {
        total: 2,
        groups: [
          { id: 'group1', name: 'Group 1', createdAt: new Date() },
          { id: 'group2', name: 'Group 2', createdAt: new Date() },
        ],
      };

      groupServiceMock.listGroups!.mockResolvedValue(mockGroups);

      const result = await controller.listGroups();
      expect(result).toEqual(mockGroups);
      expect(groupServiceMock.listGroups).toHaveBeenCalled();
    });
  });

  describe('.createGroup', () => {
    it('should create a new group and return it', async () => {
      const mockCreatedGroup = {
        id: 'new-group-id',
        name: 'New Group',
        createdAt: new Date(),
      };

      groupServiceMock.createGroup!.mockResolvedValue(mockCreatedGroup);

      const result = await controller.createGroup({ name: 'New Group' });
      expect(result).toEqual(mockCreatedGroup);
      expect(groupServiceMock.createGroup).toHaveBeenCalledWith('New Group');
    });
  });
});

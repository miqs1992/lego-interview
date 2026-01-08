import { Injectable } from '@nestjs/common';
import { GroupsRepository } from '../../shared/database/database/repositories/groups/groups.repository';
import { GroupResponseDto, ListGroupsResponseDto } from '../dtos/group-response.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async listGroups(): Promise<ListGroupsResponseDto> {
    const groups = await this.groupsRepository.find({ order: { name: 'ASC' } });

    return {
      total: groups.length,
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        createdAt: group.createdAt,
      })),
    };
  }

  async createGroup(name: string): Promise<GroupResponseDto> {
    const newGroup = await this.groupsRepository.createGroup(name);

    return {
      id: newGroup.id,
      name: newGroup.name,
      createdAt: newGroup.createdAt,
    };
  }
}

import { GroupEntity } from '../../entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class GroupsRepository extends Repository<GroupEntity> {
  constructor(private dataSource: DataSource) {
    super(GroupEntity, dataSource.createEntityManager());
  }

  findByName(name: string) {
    return this.findOne({ where: { name } });
  }

  async createGroup(name: string): Promise<GroupEntity> {
    const existing = await this.findByName(name);
    if (existing) {
      throw new ConflictException(`Group with name "${name}" already exists`);
    }

    const group = this.create({ name });
    return this.save(group);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { GroupResponseDto, ListGroupsResponseDto } from '../dtos/group-response.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOkResponse({
    description: 'List of all groups',
    type: ListGroupsResponseDto,
  })
  @Get('/')
  async listGroups() {
    return this.groupService.listGroups();
  }

  @ApiCreatedResponse({
    description: 'The group has been successfully created',
    type: GroupResponseDto,
  })
  @Post('/')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto.name);
  }
}

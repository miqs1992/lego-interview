import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the group',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the group',
    example: 'Molding',
  })
  name: string;

  @ApiProperty({
    description: 'Date when the group was created',
    example: '2026-01-08T12:00:00.000Z',
  })
  createdAt: Date;
}

export class ListGroupsResponseDto {
  @ApiProperty({
    description: 'Total number of groups',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'List of groups',
    type: [GroupResponseDto],
  })
  groups: GroupResponseDto[];
}

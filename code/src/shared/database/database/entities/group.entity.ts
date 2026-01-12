import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity('groups')
export class GroupEntity {
  @ApiProperty({
    description: 'Unique identifier of the group',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the group',
    example: 'Production Line A',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Date when the group was created',
    example: '2026-01-08T12:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => DeviceEntity, (device) => device.group)
  devices: DeviceEntity[];
}

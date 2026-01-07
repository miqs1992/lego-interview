import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { HeartbeatEntity } from './heartbeat.entity';
import { DeviceLatestHeartbeatView } from '../views/device-latest-heartbeat.view';

@Entity('devices')
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  macAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => GroupEntity, (group) => group.devices, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @OneToMany(() => HeartbeatEntity, (heartbeat) => heartbeat.device)
  heartbeats: HeartbeatEntity[];

  // Relation to SQL view for latest heartbeat, no decorators should be applied
  latestHeartbeat?: DeviceLatestHeartbeatView;
}

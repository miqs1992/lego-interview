import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { GroupEntity } from './group.entity';
import { HeartbeatEntity } from './heartbeat.entity';
import { DeviceLatestHeartbeatView } from '../views/device-latest-heartbeat.view';
import { DeviceDataType } from '../enums/device-data-type.enum';
import { DeviceDataEntity } from './device-data.entity';

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

  @Column({ type: 'enum', enum: DeviceDataType, nullable: true })
  dataType: DeviceDataType | null;

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

  @OneToMany(() => DeviceDataEntity, (data) => data.device)
  dataRecords: DeviceDataEntity[];
}

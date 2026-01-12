import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity('device_data')
@Index('idx_device_data_device_created_at_desc', ['device', 'createdAt'])
export class DeviceDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @ManyToOne(() => DeviceEntity, (device) => device.heartbeats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;
}

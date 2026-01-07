import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity('heartbeats')
@Index('idx_heartbeats_device_created_at_desc', ['device', 'createdAt'])
export class HeartbeatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  imageName: string;

  @ManyToOne(() => DeviceEntity, (device) => device.heartbeats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;
}

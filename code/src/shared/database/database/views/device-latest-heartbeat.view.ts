import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'device_latest_heartbeat',
  expression: `
    SELECT DISTINCT ON (device_id)
      id,
      device_id,
      image_name,
      created_at
    FROM heartbeats
    ORDER BY device_id, created_at DESC
  `,
})
export class DeviceLatestHeartbeatView {
  @ViewColumn()
  id: string;

  @ViewColumn({ name: 'device_id' })
  deviceId: string;

  @ViewColumn({ name: 'image_name' })
  imageName: string;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;
}

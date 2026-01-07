import { ConfigurationService } from '../config/configuration/configuration.service';
import { ClientProvider, Transport } from '@nestjs/microservices';

export const MQTT_CLIENT = 'MQTT_CLIENT';

export const mqttConfig = (config: ConfigurationService): ClientProvider => ({
  transport: Transport.MQTT,
  options: {
    url: `mqtt://${config.queue.host}:${config.queue.port}`,
  },
});

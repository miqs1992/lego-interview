import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MQTT_CLIENT, mqttConfig } from "./mqtt.config";
import { ConfigurationService } from "../config/configuration/configuration.service";
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: MQTT_CLIENT,
      useFactory: mqttConfig,
      inject: [ConfigurationService],
    }])
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

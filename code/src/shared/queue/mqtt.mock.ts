import { MQTT_CLIENT } from './mqtt.config';
import { Provider } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';

export const createMqttMock = (): Provider => ({
  provide: MQTT_CLIENT,
  useValue: { emit: jest.fn() },
});

export const createMqttContextMock = (topic: string): MqttContext => {
  return {
    getTopic: jest.fn().mockReturnValue(topic),
    getPacket: jest.fn(),
  } as unknown as MqttContext;
};

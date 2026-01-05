import { MQTT_CLIENT } from "./mqtt.config";
import { Provider } from "@nestjs/common";

export const createMqttMock = (): Provider => ({
  provide: MQTT_CLIENT,
  useValue: { emit: jest.fn() },
})
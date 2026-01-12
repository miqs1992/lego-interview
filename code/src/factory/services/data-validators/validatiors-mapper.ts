import { DeviceDataType } from '../../../shared/database/database/enums/device-data-type.enum';
import { ThermometerDto } from './thermometer.dto';
import { ColorQualityDto } from './color-quality.dto';
import { PressureSensorDto } from './pressre-sensor.dto';
import { ClassConstructor } from 'class-transformer';

export const validatorsMapper: Record<DeviceDataType, ClassConstructor<object>> = {
  [DeviceDataType.THERMOMETER]: ThermometerDto,
  [DeviceDataType.COLOR_QUALITY_SENSOR]: ColorQualityDto,
  [DeviceDataType.PRESSURE_SENSOR]: PressureSensorDto,
};

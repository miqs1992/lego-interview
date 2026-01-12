import { IsNumber, Min, Max } from 'class-validator';

export class PressureSensorDto implements PressureSensorData {
  @IsNumber()
  @Min(0)
  @Max(2000)
  injectionPressure: number;

  @IsNumber()
  @Min(0)
  @Max(500)
  holdingPressure: number;
}

export interface PressureSensorData {
  injectionPressure: number;
  holdingPressure: number;
}

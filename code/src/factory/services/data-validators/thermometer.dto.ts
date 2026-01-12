import { IsNumber, Max, Min } from 'class-validator';

export class ThermometerDto implements ThermometerData {
  @IsNumber()
  temperature: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;
}

export interface ThermometerData {
  temperature: number;
  humidity: number;
}

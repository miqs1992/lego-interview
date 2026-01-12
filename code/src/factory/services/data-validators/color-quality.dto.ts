import { IsNumber, Min, Max, IsHexColor } from 'class-validator';

export class ColorQualityDto implements ColorQualityData {
  @IsHexColor()
  detectedColor: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  colorAccuracy: number;

  @IsNumber()
  @Min(0)
  @Max(255)
  brightness: number;
}

export interface ColorQualityData {
  detectedColor: string;
  colorAccuracy: number;
  brightness: number;
}

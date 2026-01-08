import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    description: 'The name of the group',
    example: 'Production Line A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

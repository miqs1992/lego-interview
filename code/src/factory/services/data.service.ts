import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DevicesRepository } from '../../shared/database/database/repositories/devices/devices.repository';
import { DeviceDataRepository } from '../../shared/database/database/repositories/device-data/device-data.repository';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { validatorsMapper } from './data-validators/validatiors-mapper';
import { DeviceDataType } from '../../shared/database/database/enums/device-data-type.enum';

@Injectable()
export class DataService {
  private readonly logger: Logger = new Logger(DataService.name);

  constructor(
    private deviceDataRepository: DeviceDataRepository,
    private devicesRepository: DevicesRepository,
  ) {}

  async processDeviceData(deviceId: string, data: Record<string, any>) {
    const device = await this.devicesRepository.findOne({ where: { id: deviceId } });

    if (!device) {
      const msg = `Device with ID "${deviceId}" not found`;
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    if (!device.dataType) {
      const msg = `Device with ID "${deviceId}" not found`;
      this.logger.error(msg);
      throw new NotFoundException(msg);
    }

    await this.validateData(device.dataType, data);

    const deviceData = await this.deviceDataRepository.createDeviceData(deviceId, data);

    this.logger.log(`Stored data for device ${deviceId} with data ID ${deviceData.id}`);

    return deviceData;
  }

  private async validateData(dataType: DeviceDataType, data: Record<string, any>): Promise<void> {
    const validationClass = validatorsMapper[dataType];

    try {
      const dto = plainToInstance(validationClass, data);
      await validateOrReject(dto, { whitelist: true, forbidNonWhitelisted: true });
    } catch (errors: unknown) {
      this.logger.error('Invalid MQTT payload');
      throw new BadRequestException({
        message: 'Invalid MQTT payload',
        errors,
      });
    }
  }
}

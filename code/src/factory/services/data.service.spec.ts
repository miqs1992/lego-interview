import { DataService } from './data.service';
import { DevicesRepository } from '../../shared/database/database/repositories/devices/devices.repository';
import { DeviceDataRepository } from '../../shared/database/database/repositories/device-data/device-data.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DeviceEntity } from '../../shared/database/database/entities/device.entity';
import { DeviceDataEntity } from '../../shared/database/database/entities/device-data.entity';
import { DeviceDataType } from '../../shared/database/database/enums/device-data-type.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DataService', () => {
  let service: DataService;

  const devicesRepositoryMock: Partial<jest.Mocked<DevicesRepository>> = {
    findOne: jest.fn(),
  };

  const deviceDataRepositoryMock: Partial<jest.Mocked<DeviceDataRepository>> = {
    createDeviceData: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: DevicesRepository,
          useValue: devicesRepositoryMock,
        },
        {
          provide: DeviceDataRepository,
          useValue: deviceDataRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.processDeviceData', () => {
    describe('when device does not exist', () => {
      it('should throw NotFoundException', async () => {
        devicesRepositoryMock.findOne!.mockResolvedValue(null);

        await expect(service.processDeviceData('nonexistent-device', {})).rejects.toThrow(NotFoundException);
        await expect(service.processDeviceData('nonexistent-device', {})).rejects.toThrow(
          'Device with ID "nonexistent-device" not found',
        );
      });
    });

    describe('when device has no dataType', () => {
      it('should throw NotFoundException', async () => {
        const mockDevice: Partial<DeviceEntity> = {
          id: 'device-1',
          name: 'Test Device',
          dataType: null,
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockDevice as DeviceEntity);

        await expect(service.processDeviceData('device-1', {})).rejects.toThrow(NotFoundException);
      });
    });

    describe('when processing thermometer data', () => {
      const mockThermometerDevice: Partial<DeviceEntity> = {
        id: 'thermometer-device-1',
        name: 'Thermometer Device',
        dataType: DeviceDataType.THERMOMETER,
      };

      it('should store valid thermometer data', async () => {
        const validThermometerData = {
          temperature: 25.5,
          humidity: 60,
        };

        const mockDeviceData: Partial<DeviceDataEntity> = {
          id: 'data-1',
          data: validThermometerData,
          createdAt: new Date(),
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockThermometerDevice as DeviceEntity);
        deviceDataRepositoryMock.createDeviceData!.mockResolvedValue(mockDeviceData as DeviceDataEntity);

        const result = await service.processDeviceData('thermometer-device-1', validThermometerData);

        expect(deviceDataRepositoryMock.createDeviceData).toHaveBeenCalledWith('thermometer-device-1', validThermometerData);
        expect(result).toEqual(mockDeviceData);
      });

      it('should throw BadRequestException for invalid thermometer data (missing temperature)', async () => {
        const invalidData = {
          humidity: 60,
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockThermometerDevice as DeviceEntity);

        await expect(service.processDeviceData('thermometer-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException for invalid thermometer data (humidity out of range)', async () => {
        const invalidData = {
          temperature: 25.5,
          humidity: 150, // Max is 100
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockThermometerDevice as DeviceEntity);

        await expect(service.processDeviceData('thermometer-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException for non-whitelisted properties', async () => {
        const invalidData = {
          temperature: 25.5,
          humidity: 60,
          extraField: 'not allowed',
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockThermometerDevice as DeviceEntity);

        await expect(service.processDeviceData('thermometer-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });
    });

    describe('when processing color quality sensor data', () => {
      const mockColorQualityDevice: Partial<DeviceEntity> = {
        id: 'color-sensor-device-1',
        name: 'Color Quality Sensor Device',
        dataType: DeviceDataType.COLOR_QUALITY_SENSOR,
      };

      it('should store valid color quality data', async () => {
        const validColorQualityData = {
          detectedColor: '#FF5733',
          colorAccuracy: 95.5,
          brightness: 200,
        };

        const mockDeviceData: Partial<DeviceDataEntity> = {
          id: 'data-2',
          data: validColorQualityData,
          createdAt: new Date(),
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockColorQualityDevice as DeviceEntity);
        deviceDataRepositoryMock.createDeviceData!.mockResolvedValue(mockDeviceData as DeviceDataEntity);

        const result = await service.processDeviceData('color-sensor-device-1', validColorQualityData);

        expect(deviceDataRepositoryMock.createDeviceData).toHaveBeenCalledWith('color-sensor-device-1', validColorQualityData);
        expect(result).toEqual(mockDeviceData);
      });

      it('should throw BadRequestException for invalid hex color', async () => {
        const invalidData = {
          detectedColor: 'not-a-hex-color',
          colorAccuracy: 95.5,
          brightness: 200,
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockColorQualityDevice as DeviceEntity);

        await expect(service.processDeviceData('color-sensor-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException for colorAccuracy out of range', async () => {
        const invalidData = {
          detectedColor: '#FF5733',
          colorAccuracy: 110, // Max is 100
          brightness: 200,
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockColorQualityDevice as DeviceEntity);

        await expect(service.processDeviceData('color-sensor-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException for brightness out of range', async () => {
        const invalidData = {
          detectedColor: '#FF5733',
          colorAccuracy: 95.5,
          brightness: 300, // Max is 255
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockColorQualityDevice as DeviceEntity);

        await expect(service.processDeviceData('color-sensor-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });

      it('should throw BadRequestException for missing required fields', async () => {
        const invalidData = {
          detectedColor: '#FF5733',
          // missing colorAccuracy and brightness
        };

        devicesRepositoryMock.findOne!.mockResolvedValue(mockColorQualityDevice as DeviceEntity);

        await expect(service.processDeviceData('color-sensor-device-1', invalidData)).rejects.toThrow(BadRequestException);
      });
    });
  });
});

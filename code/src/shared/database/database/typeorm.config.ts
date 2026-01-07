import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigurationService } from '../../config/configuration/configuration.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmConfig = (config: ConfigurationService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,

  autoLoadEntities: true,
  namingStrategy: new SnakeNamingStrategy(),

  synchronize: !config.isProduction(),
  logging: config.isDevelopment(),
  dropSchema: config.isTest(),
});

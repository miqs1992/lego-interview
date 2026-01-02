import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database';
import { ConfigurationModule } from './shared/config/configuration';

@Module({
  imports: [DatabaseModule, ConfigurationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

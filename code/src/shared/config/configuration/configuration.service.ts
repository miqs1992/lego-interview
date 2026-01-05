import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import GlobalConfiguration from './global-configuration.interface';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService<GlobalConfiguration>) {}

  get port(): number {
    return this.configService.get<number>('port', { infer: true }) as number;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('nodeEnv', { infer: true })!;
  }

  get database(): GlobalConfiguration['database'] {
    return this.configService.get<GlobalConfiguration['database']>('database', {
      infer: true,
    })! as GlobalConfiguration['database'];
  }

  get queue(): GlobalConfiguration['queue'] {
    return this.configService.get<GlobalConfiguration['queue']>('queue', {
      infer: true,
    })! as GlobalConfiguration['queue'];
  }

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }
}

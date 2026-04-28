import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppLoggerService } from './app-logger.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}

import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format, transports, createLogger, Logger } from 'winston';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(configService: ConfigService) {
    this.logger = createLogger({
      level: configService.get<string>('LOG_LEVEL') ?? 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, stack, context, ...meta }) =>
          JSON.stringify({
            timestamp,
            level,
            context,
            message,
            stack,
            ...meta,
          }),
        ),
      ),
      transports: [new transports.Console()],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: unknown, meta?: Record<string, unknown>): void {
    this.logger.error(message, {
      stack: trace instanceof Error ? trace.stack : trace,
      ...meta,
    });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}

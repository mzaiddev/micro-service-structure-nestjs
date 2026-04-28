import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { SERVICE_REGISTRY } from './constants/service-registry';
import type { ServiceKey } from './constants/service-registry';

export function createRmqOptions(configService: ConfigService, serviceKey: ServiceKey) {
  const service = SERVICE_REGISTRY[serviceKey];

  return {
    urls: [configService.get<string>('RMQ_URI') ?? process.env.RMQ_URI ?? 'amqp://localhost:5672'],
    queue: configService.get<string>(service.queueEnv) ?? service.queue,
    queueOptions: {
      durable: true,
    },
    noAck: false,
    prefetchCount: 10,
  };
}

export function registerRmqClients(serviceKeys: ServiceKey[]) {
  return ClientsModule.registerAsync(
    serviceKeys.map((serviceKey) => ({
      name: SERVICE_REGISTRY[serviceKey].token,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: createRmqOptions(configService, serviceKey),
      }),
    })),
  );
}

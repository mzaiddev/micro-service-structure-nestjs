export interface ServiceBootstrapOptions {
  appName: string;
  port: number;
  globalPrefix?: string;
  swaggerPath?: string;
  swaggerEnabled?: boolean;
  serviceDescription?: string;
}

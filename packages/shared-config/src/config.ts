import { validateEnv, type Env } from './env';

/**
 * Application configuration
 */
export class Config {
  private static instance: Config;
  private env: Env;

  private constructor() {
    this.env = validateEnv();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getEnv(): Env {
    return this.env;
  }

  public getDatabaseUrl(): string {
    return this.env.DATABASE_URL;
  }

  public getServiceUrl(service: string): string {
    const url = this.env[`${service.toUpperCase()}_SERVICE_URL` as keyof Env] as string | undefined;
    if (!url) {
      throw new Error(`Service URL for ${service} is not configured`);
    }
    return url;
  }

  public getJwtSecret(): string {
    return this.env.JWT_SECRET;
  }

  public getJwtRefreshSecret(): string {
    return this.env.JWT_REFRESH_SECRET;
  }

  public isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }
}


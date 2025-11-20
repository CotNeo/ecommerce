import { z } from 'zod';

/**
 * Environment variables schema
 */
export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Service URLs
  AUTH_SERVICE_URL: z.string().url().optional(),
  CATALOG_SERVICE_URL: z.string().url().optional(),
  CART_SERVICE_URL: z.string().url().optional(),
  ORDER_SERVICE_URL: z.string().url().optional(),
  PAYMENT_SERVICE_URL: z.string().url().optional(),
  NOTIFICATION_SERVICE_URL: z.string().url().optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Payment Provider
  PAYMENT_PROVIDER_API_KEY: z.string().optional(),
  PAYMENT_PROVIDER_SECRET_KEY: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // App
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('3000'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 */
export function validateEnv(): Env {
  try {
    // In development, provide defaults for required fields if not set
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    if (isDevelopment) {
      // Set defaults for development
      if (!process.env.DATABASE_URL) {
        process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public';
      }
      if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'dev-jwt-secret-key-min-32-chars-long-for-development-only';
      }
      if (!process.env.JWT_REFRESH_SECRET) {
        process.env.JWT_REFRESH_SECRET = 'dev-refresh-secret-key-min-32-chars-long-for-development-only';
      }
    }
    
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Config] Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid environment variables');
    }
    throw error;
  }
}


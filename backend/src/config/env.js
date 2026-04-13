import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export function getEnv(key, defaultValue) {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue;
}

const nodeEnv = getEnv('NODE_ENV', 'development');
const isProduction = nodeEnv === 'production';
const disableWatchmode = getEnv('DISABLE_WATCHMODE', 'false') === 'true';
const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const localClientOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const defaultClientOrigins = vercelOrigin ? [vercelOrigin] : localClientOrigins;

function getProductionEnv(key, defaultValue) {
  const value = process.env[key];
  if (value) return value;
  if (isProduction && defaultValue === undefined) {
    throw new Error(`Missing production environment variable: ${key}`);
  }
  return defaultValue;
}

const jwtSecret = getProductionEnv('JWT_SECRET', isProduction ? undefined : 'your-secret-key-change-this');
if (isProduction && jwtSecret === 'your-secret-key-change-this') {
  throw new Error('JWT_SECRET must be changed before production deployment');
}

const watchmodeApiKey = process.env.WATCHMODE_API_KEY || '';
if (isProduction && !disableWatchmode && !watchmodeApiKey) {
  throw new Error('WATCHMODE_API_KEY is required when DISABLE_WATCHMODE is false');
}

const configuredClientOrigins = getProductionEnv('CLIENT_ORIGIN', defaultClientOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const clientOrigins = isProduction
  ? configuredClientOrigins
  : Array.from(new Set([...configuredClientOrigins, ...localClientOrigins]));

export const config = {
  port: parseInt(getEnv('PORT', '5001')),
  mongodbUri: getProductionEnv('MONGODB_URI', isProduction ? undefined : 'mongodb://localhost:27017/seen'),
  jwtSecret,
  clientOrigin: clientOrigins[0],
  clientOrigins,
  nodeEnv,
  disableWatchmode,
  watchmodeApiKey,
};

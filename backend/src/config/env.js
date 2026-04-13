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

function getProductionEnv(key, defaultValue) {
  const value = process.env[key];
  if (value) return value;
  if (isProduction) {
    throw new Error(`Missing production environment variable: ${key}`);
  }
  return defaultValue;
}

const jwtSecret = getProductionEnv('JWT_SECRET', 'your-secret-key-change-this');
if (isProduction && jwtSecret === 'your-secret-key-change-this') {
  throw new Error('JWT_SECRET must be changed before production deployment');
}

const watchmodeApiKey = process.env.WATCHMODE_API_KEY || '';
if (isProduction && !disableWatchmode && !watchmodeApiKey) {
  throw new Error('WATCHMODE_API_KEY is required when DISABLE_WATCHMODE is false');
}

export const config = {
  port: parseInt(getEnv('PORT', '5001')),
  mongodbUri: getProductionEnv('MONGODB_URI', 'mongodb://localhost:27017/seen'),
  jwtSecret,
  clientOrigin: getProductionEnv('CLIENT_ORIGIN', 'http://localhost:5174'),
  clientOrigins: getProductionEnv('CLIENT_ORIGIN', 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  nodeEnv,
  disableWatchmode,
  watchmodeApiKey,
};

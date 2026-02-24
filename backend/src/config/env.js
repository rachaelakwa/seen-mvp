export function getEnv(key, defaultValue) {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue;
}

export const config = {
  port: parseInt(getEnv('PORT', '5001')),
  mongodbUri: getEnv('MONGODB_URI', 'mongodb://localhost:27017/seen'),
  jwtSecret: getEnv('JWT_SECRET', 'your-secret-key-change-this'),
  clientOrigin: getEnv('CLIENT_ORIGIN', 'http://localhost:5173'),
  nodeEnv: getEnv('NODE_ENV', 'development'),
};

console.log('DEBUG: Loaded PORT =', process.env.PORT, ', config.port =', config.port);

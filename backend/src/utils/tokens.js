import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function generateToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}

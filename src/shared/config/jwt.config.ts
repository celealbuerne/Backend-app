import type { SignOptions } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida.');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN ??
  '24h') as SignOptions['expiresIn'];

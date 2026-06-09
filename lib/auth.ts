import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET environment variable');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(adminId: string, email: string): string {
  return jwt.sign({ adminId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { adminId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  
  try {
    const token = auth.replace('Bearer ', '');
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (e) {
    console.error('Token verification failed:', e);
    return null;
  }
}
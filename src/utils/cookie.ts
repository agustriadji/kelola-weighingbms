import { serialize, parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

//const COOKIE_NAME = 'auth';
const MAX_AGE = 60 * 60 * 24; // 1 hari

// 🔑 Set cookie
export function setCookie(res: NextApiResponse, COOKIE_NAME: string, value: string) {
  const cookie = serialize(COOKIE_NAME, value, {
    httpOnly: true,
    //secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}

// 🔑 Get cookie dari request
export function getCookie(req: NextApiRequest, COOKIE_NAME: string): any | null {
  const cookies = parse(req.headers.cookie || '');
  return cookies[COOKIE_NAME] || null;
}

// 🔑 Clear cookie (logout)
export function clearCookie(res: NextApiResponse, COOKIE_NAME: string) {
  const cookie = serialize(COOKIE_NAME, '', {
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}

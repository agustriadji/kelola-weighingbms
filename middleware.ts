import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/api/auth/login', '/login', '/'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.info('=== MIDDLEWARE CALLED ===');
  console.info('Pathname:', pathname);

  // 1. if public route → allow
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    console.info('Public path, allowing');
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');
  console.info('Auth header:', auth);

  if (!auth) {
    console.info('No auth header');
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = auth.replace('Bearer ', '');
  console.info('Token:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.info('Token decoded successfully:', decoded);

    // inject user data to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user', JSON.stringify(decoded));
    console.info('Setting x-user header:', JSON.stringify(decoded));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (e) {
    console.info('Token verification failed:', e);
    return new NextResponse(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

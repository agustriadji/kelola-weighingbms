import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/api/auth/login', '/login', '/logout'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. if public route → allow
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    console.info('Public path, allowing');
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');

  if (!auth) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const token = auth.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // inject user data to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user', JSON.stringify(decoded));

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
  matcher: ['/((?!_next/static|_next/images|favicon.ico).*)'],
};

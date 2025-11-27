import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/api/auth/login", "/login", "/"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log('=== MIDDLEWARE CALLED ===');
  console.log('Pathname:', pathname);
  console.log('All headers:', Object.fromEntries(req.headers.entries()));

  // 1. if public route → allow
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    console.log('Public path, allowing');
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  console.log('Auth header:', auth);
  
  if (!auth) {
    console.log('No auth header');
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const token = auth.replace("Bearer ", "");
  console.log('Token:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('Token decoded successfully:', decoded);
    
    // inject user data to request
    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify(decoded));
    
    // Also try setting it in request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(decoded));
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });

  } catch (e) {
    console.log('Token verification failed:', e);
    return new NextResponse(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/((?!auth/login).*)',
    '/dashboard/:path*',
    '/user/:path*'
  ]
}
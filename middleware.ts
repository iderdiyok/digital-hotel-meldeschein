// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

console.log('🔥 Middleware loaded!');

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log('🔍 Checking:', path);

  // Protect only /form routes
  if (!path.startsWith('/form')) {
    return NextResponse.next();
  }

  console.log('🛡️ Protected route');

  const auth = req.headers.get('authorization');

  if (!auth) {
    console.log('❌ No auth header → prompting');
    return new Response('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const [, encoded] = auth.split(' ');
  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');

  const OK =
    user === (process.env.BASIC_AUTH_USER || 'hhhof') &&
    pass === (process.env.BASIC_AUTH_PASS || 'geheim');

  if (!OK) {
    console.log('❌ Wrong credentials');
    return new Response('Access denied', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  console.log('✅ Auth success');
  return NextResponse.next();
}

export const config = {
  matcher: ['/form/:path*'],
};

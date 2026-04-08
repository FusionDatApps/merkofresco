import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("merkofresco_token")?.value;
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // SOLO proteger dashboard
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ❌ ELIMINAMOS redirección automática desde login/register
  // Esto estaba causando el bucle

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
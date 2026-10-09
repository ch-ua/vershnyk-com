import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const separator = decoded.indexOf(":");
      const suppliedUser = decoded.slice(0, separator);
      const suppliedPassword = decoded.slice(separator + 1);
      if (separator >= 0 && suppliedUser === user && suppliedPassword === password) {
        return NextResponse.next();
      }
    } catch {}
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="VERSHNYK Admin", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = { matcher: ["/admin/:path*"] };

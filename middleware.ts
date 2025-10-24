import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const session = request.cookies.get("session")?.value

  // Check if the path is protected and there's no session
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  if (isProtectedRoute && session !== "authenticated") {
    // Redirect to login with the return URL
    const url = new URL("/login", request.url)
    url.searchParams.set("returnUrl", path)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}

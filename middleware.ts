import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/dashboard"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 1. Intercept /stockscreen and proxy it directly to Netlify!
  if (path.startsWith("/stockscreen")) {
    const url = new URL(request.url)
    const targetUrl = new URL(path, "https://siskostock.netlify.app")
    targetUrl.search = url.search // Preserve query parameters
    return NextResponse.rewrite(targetUrl)
  }

  // 2. Your existing auth logic
  const session = request.cookies.get("session")?.value
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  if (isProtectedRoute && session !== "authenticated") {
    const url = new URL("/login", request.url)
    url.searchParams.set("returnUrl", path)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // IMPORTANT: We removed _next/static from the exclusion list 
  // so that the Netlify app's CSS and Javascript files can be proxied successfully!
  matcher: ["/((?!api|_next/image|favicon.ico|public).*)"],
}

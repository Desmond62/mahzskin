import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const protectedRoutes = ["/checkout"]  // Only checkout requires authentication now

    // Check if the path starts with any protected route
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    if (isProtectedRoute) {
        // For client-side routes, we'll handle auth in the components
        // Middleware can't access localStorage, so we redirect to a check page
        const authCheck = request.cookies.get("fw_auth_check")
        
        if (!authCheck) {
            // Set a cookie to indicate we need to check auth on client side
            const response = NextResponse.next()
            response.cookies.set("fw_needs_auth_check", "true", { maxAge: 60 })
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/checkout"],  // Only protect checkout route
}

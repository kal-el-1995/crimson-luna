export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/cart/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/onboarding/:path*",
  ],
};

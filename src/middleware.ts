import { NextResponse } from "next/server";

export function middleware() {
  // No longer need to handle locale-based routing
  // All pages use query parameter ?lang=en for language switching
  // The locale detection is done in components/pages as needed
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.pdf|.*\\.png|.*\\.jpg|.*\\.xml|.*\\.txt).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  handleLocaleRedirect,
  handleErrorRedirect,
  handleDeploymentProtection,
} from "@repo/components/utils";

export function proxy(request: NextRequest) {
  // Use the shared error redirect handler
  const errorRedirect = handleErrorRedirect(request);
  if (errorRedirect) return errorRedirect;

  const url = new URL(request.url);

  // Only call locale inspection for paths without file extensions
  const hasFileExtension = /\.[^/]*$/.test(url.pathname);
  if (!hasFileExtension) {
    const localeResponse = handleLocaleRedirect(request);
    if (localeResponse) return localeResponse;
  }

  // Handle Vercel deployment protection for Builder.io
  let response = NextResponse.next();
  response = handleDeploymentProtection(request, response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 500 (to prevent redirect loops)
     * - static-asset extensions (images, fonts, css/js, txt/xml/map): these
     *   bypass the proxy entirely so they incur no Edge Middleware Invocation.
     *   Document extensions (.html/.pdf) are deliberately NOT excluded so any
     *   legacy URL redirects still flow through the proxy.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|500|.*\\.(?:js|mjs|css|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico|txt|xml|map)$).*)",
  ],
};

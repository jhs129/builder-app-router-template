import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getLocaleRedirectPath } from "./localeUtils";

export const handleLocaleRedirect = (request: NextRequest) => {
  const url = new URL(request.url);
  
  // Get preferred language from Accept-Language header as fallback
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLanguage = request.cookies.get("preferred_language")?.value || 
    acceptLanguage?.split(',')[0]?.split('-')[0];

  const defaultLocale = 'en';
  const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];

  const redirectPath = getLocaleRedirectPath({
    pathname: url.pathname,
    preferredLanguage,
    supportedLocales,
    defaultLocale,
  });

  if (redirectPath) {
    const redirectUrl = new URL(redirectPath, request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // Set the preferred language cookie if we're redirecting
    if (preferredLanguage && supportedLocales.includes(preferredLanguage)) {
      response.cookies.set('preferred_language', preferredLanguage, {
        maxAge: 31536000, // 1 year
        path: '/',
      });
    }
    
    return response;
  }
  
  return NextResponse.next();
};

export const handleErrorRedirect = (request: NextRequest) => {
  const url = new URL(request.url);
  const errorCode = url.searchParams.get("errorCode");
  const errorMessage = url.searchParams.get("errorMessage");

  if (errorCode && /^5[0-9]{2}$/.test(errorCode)) {
    const redirectUrl = new URL("/500", request.url);
    redirectUrl.searchParams.set("errorCode", errorCode);
    if (errorMessage) {
      redirectUrl.searchParams.set("errorMessage", errorMessage);
    }
    return NextResponse.redirect(redirectUrl);
  }
};

export const handleDeploymentProtection = (request: NextRequest, response: NextResponse) => {
  // Handle Vercel deployment protection bypass for Builder.io
  // This allows Builder.io to access password-protected Vercel deployments
  
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const builderBypass = request.headers.get("x-builder-bypass");
  
  // Check if this is a Builder.io request that needs bypass
  const isBuilderRequest = builderBypass || 
    userAgent.includes("builder.io") || 
    userAgent.includes("BuilderBot") ||
    url.searchParams.has("builder.overrides") ||
    url.pathname.includes("/__builder_editing__");
  
  if (isBuilderRequest) {
    // Set headers to bypass Vercel deployment protection
    response.headers.set("x-vercel-protection-bypass", process.env.VERCEL_PROTECTION_BYPASS || "");
    
    // Also set the Builder.io specific headers if needed
    if (builderBypass) {
      response.headers.set("x-builder-bypass", builderBypass);
    }
  }
  
  return response;
};
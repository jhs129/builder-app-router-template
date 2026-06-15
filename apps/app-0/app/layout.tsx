import type { Metadata, Viewport } from "next";
import { Poppins, Nothing_You_Could_Do } from "next/font/google";
import "../styles/globals.css";
import { SiteContextProvider } from "@repo/components";
import { getSiteContext } from "../lib/builder";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const fontAccent = Nothing_You_Could_Do({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: { url: "/favicon.ico", type: "image/png" },
    apple: "/favicon.ico",
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6610F2",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // site-context is global and largely locale-independent. The shared root
  // layout defaults to 'en'; per-page locale is resolved in the routes.
  const siteContext = await getSiteContext("en");

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontAccent.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white"
        >
          Skip to main content
        </a>
        <SiteContextProvider siteContext={siteContext}>
          {children}
        </SiteContextProvider>
      </body>
    </html>
  );
}

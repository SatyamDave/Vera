import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import "./globals.css";

let title = "VERA AI – Transform Ideas Into Reality";
let description = "VERA AI - The ultimate AI-powered platform for transforming your ideas into full-stack applications. Build, deploy, and scale with intelligent code generation.";
let url = "https://vera.ai/";
let ogimage = "https://vera.ai/og-image.png";
let sitename = "VERA AI";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <PlausibleProvider domain="vera.ai" />
      </head>
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}

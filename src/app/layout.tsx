import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2ecc71",
};

/**
 * En production sur Vercel, VERCEL_PROJECT_PRODUCTION_URL (domaine stable du
 * projet) est fourni automatiquement, sans configuration manuelle nécessaire.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";
const title = "L'Isle aux énigmes";
const description =
  "Chasse au trésor géolocalisée autour du lac de L'Isle-Jourdain";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Isle Enigmes",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/icons/boussole.jpg", width: 1920, height: 1280 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/icons/boussole.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}

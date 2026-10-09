import type { Metadata, Viewport } from "next";
import { Geist, Caveat, Merienda, Handlee } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const siteUrl = "https://write-in.shaniweb.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Write-in — Journal & Language Learning",
  description:
    "Write what you think. Learn how to say it. Your thoughts, translated into your next language.",
  applicationName: "Write-in",
  authors: [{ name: "Write-in" }],
  keywords: [
    "Write-in",
    "Write On Me",
    "Language Learning Journal",
    "Daily Language Practice",
    "Translate Thoughts",
    "Learn Spanish",
    "Learn French",
    "Learn German",
    "Learn Japanese",
    "Journaling",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Write-in",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Write-in — Journal & Language Learning",
    description:
      "Write what you think. Learn how to say it. Your thoughts, translated into your next language.",
    type: "website",
    url: "/",
    siteName: "Write-in",
    locale: "en_US",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Write-in Logo and Preview",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Write-in — Journal & Language Learning",
    description:
      "Write what you think. Learn how to say it. Your thoughts, translated into your next language.",
    images: ["/web-app-manifest-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${caveat.variable} ${merienda.variable} ${handlee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

// fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
});

const handlee = Handlee({
  variable: "--font-handlee",
  subsets: ["latin"],
  weight: "400",
});

import type { Metadata } from "next";
import { Geist, Caveat, Indie_Flower, Patrick_Hand, Merienda, Handlee } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const indieFlower = Indie_Flower({  // should be camelCase
  variable: "--font-indie",
  subsets: ["latin"],
  weight: "400",
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: "400",
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

export const metadata: Metadata = {
  title: "Write On ME 📝",
  description: "It's an AI based journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${caveat.variable} ${indieFlower.variable} ${patrickHand.variable} ${merienda.variable} ${handlee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}


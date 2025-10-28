import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Dynamically import SpeedInsights only in production
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SpeedInsights: any = () => null;
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  SpeedInsights = require('@vercel/speed-insights/next').SpeedInsights;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IOTA DID Explorer - Learn Decentralized Identity",
  description: "Explore Decentralized Identifiers (DIDs) and Verifiable Credentials on the IOTA Tangle. Create DIDs, issue credentials, and verify them in an educational interface.",
  keywords: ["IOTA", "DID", "Decentralized Identity", "Verifiable Credentials", "Blockchain", "Web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}

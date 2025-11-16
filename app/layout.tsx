import type { Metadata } from "next";
import "./globals.css";
import "./design-system.css";
import { Providers } from "@/components/Providers";
import { SpeedInsightsWrapper } from "@/components/SpeedInsightsWrapper";

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
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <SpeedInsightsWrapper />
      </body>
    </html>
  );
}

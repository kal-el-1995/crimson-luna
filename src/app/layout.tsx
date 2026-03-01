import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { RootErrorBoundary } from "@/components/auth/RootErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crimson Luna - Menstrual Wellness",
  description:
    "Track your cycle, understand your body, and shop curated menstrual wellness products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <RootErrorBoundary>
          <SessionProvider>{children}</SessionProvider>
        </RootErrorBoundary>
      </body>
    </html>
  );
}

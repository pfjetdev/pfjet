import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FormProvider } from "@/contexts/FormContext";
import NavBar from "@/components/NavBar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Load Clash Display using next/font for optimal loading
const clashDisplay = localFont({
  src: "./ClashDisplay-Variable.ttf",
  variable: "--font-clash-display",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "PF Jet - Private Jet Charter",
  description: "Book private jet flights worldwide. Empty legs, jet sharing, and luxury charter services.",
  keywords: ["private jet", "charter", "empty legs", "jet sharing", "luxury travel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Clash Display font with highest priority */}
        <link
          rel="preload"
          href="/ClashDisplay-Variable.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${clashDisplay.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FormProvider>
            <ScrollToTop />
            <NavBar />
            {children}
            <Toaster position="top-center" closeButton />
          </FormProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

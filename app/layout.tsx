import "./globals.css";
import type { Metadata } from "next";
import { Geist_Mono, Merriweather } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Chronica",
    template: "%s | Chronica",
  },
  description: "A Simple way to manage everything about your firm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${satoshi.variable} ${geistMono.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" visibleToasts={3} />
        </Providers>
      </body>
    </html>
  );
}

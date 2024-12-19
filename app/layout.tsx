import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenAI Realtime WebRTC",
  description: "Shadcn/UI Starter for using OpenAI Realtime API with WebRTC. Powered by OpenAI's latest Realtime API (12/17/2024). Use this starter to build your own real-time voice AI application. Fastest & latest way to do Voice AI (Dec 2024), implementing API advancements of Day of OpenAI's 12 days of Christmas.",
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
        {children}
      </body>
    </html>
  );
}

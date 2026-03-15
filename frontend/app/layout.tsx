import type { Metadata } from "next";
import { Geist, Geist_Mono, Gowun_Batang } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NCafe Kids Cafe",
  description: "Handcrafted fun at NCafe",
};

import LayoutHeader from "./_components/LayoutHeader";
import QuokkaChat from "./_components/QuokkaChat";
import { CartProvider } from "./_context/CartContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} ${gowunBatang.variable} paper-bg`}>
        <CartProvider>
          <LayoutHeader />
          {children}
          <QuokkaChat />
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}

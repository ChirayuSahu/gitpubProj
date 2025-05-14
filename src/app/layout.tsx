import type { Metadata } from "next";
import { Geist, Geist_Mono, Keania_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const keania = Keania_One({
    variable: "--font-keania",
    subsets: ['latin'],
    weight: '400',
})

export const metadata: Metadata = {
  title: "Code Clash Arena",
  description: "Code Clash Arena - A platform to challenge your coding skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${keania.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

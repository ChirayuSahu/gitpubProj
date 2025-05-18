import type { Metadata } from "next";
import { Londrina_Solid, Outfit } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import AuthSessionProvider from "@/providers/authSessionProvider";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import ScreenGuard from "@/components/screenGuard";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const londrina = Londrina_Solid({
  variable: "--font-londrina",
  subsets: ['latin'],
  weight: '400',
})


export const metadata: Metadata = {
  title: "Code Clash Arena",
  description: "Code Clash Arena - A platform to challenge your coding skills.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${londrina.className} antialiased`}
      >
        <AuthSessionProvider session={session}>
          <NavbarWrapper />
          {children}
        </AuthSessionProvider>
        <ScreenGuard />
        <Toaster richColors position="top-right" theme="light" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from '@/utils/LanguageContext';
import ClientRootLayout from './ClientRootLayout';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const basePath = process.env.NODE_ENV === 'production' ? '/SuperBrainGameHub' : '';

export const metadata: Metadata = {
  title: "Super Brain Game Hub",
  description: "A collection of brain training games to challenge your mind",
  icons: {
    icon: `${basePath}/brain.png`,
    apple: `${basePath}/brain.png`,
  },
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
        <LanguageProvider>
          <ClientRootLayout>
            {children}
          </ClientRootLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}

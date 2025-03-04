import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeScript } from './components/providers/ThemeScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FHNW Dashboard',
  description: 'Your central hub for campus resources, daily menus, and real-time updates.',
  keywords: 'FHNW, dashboard, student resources, Switzerland, university tools',
  openGraph: {
    title: 'FHNW Dashboard',
    description: 'Your central hub for campus resources, daily menus, and real-time updates',
    url: 'https://fhnw.doruk.ch',
    siteName: 'FHNW Dashboard',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <ThemeScript />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
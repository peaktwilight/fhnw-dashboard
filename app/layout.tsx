import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FHNW Student Dashboard | by Doruk Tan Ozturk',
  description: 'A unified dashboard for FHNW students to access all important resources and tools. Created by Doruk Tan Ozturk.',
  keywords: 'FHNW, dashboard, student resources, Doruk Tan Ozturk, Switzerland, university tools',
  authors: [{ name: 'Doruk Tan Ozturk', url: 'https://doruk.ch' }],
  creator: 'Doruk Tan Ozturk',
  openGraph: {
    title: 'FHNW Student Dashboard',
    description: 'Your one-stop hub for all FHNW resources',
    url: 'https://fhnw.doruk.ch',
    siteName: 'FHNW Dashboard',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}>
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white no-margin">FHNW Dashboard</h1>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <a 
                href="https://doruk.ch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                by Doruk Tan Ozturk
              </a>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full px-4 py-8">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Created by{' '}
                <a 
                  href="https://doruk.ch" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Doruk Tan Ozturk
                </a>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Not affiliated with FHNW. Made by a student, for students.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 
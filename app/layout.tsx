import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeScript } from './components/providers/ThemeScript';

const inter = Inter({ subsets: ['latin'] });

// Metadata is handled in locale layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
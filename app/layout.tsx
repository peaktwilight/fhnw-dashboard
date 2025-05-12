import React from 'react';
import './globals.css';
// No longer needed since it's handled in locale layout
// import { ThemeScript } from './components/providers/ThemeScript';
// const inter = Inter({ subsets: ['latin'] });

// Metadata is handled in locale layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
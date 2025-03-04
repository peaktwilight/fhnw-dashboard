'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ThemeScript } from './ThemeScript';
import Navbar from '../Navbar';
import Footer from '../Footer';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeScript />
      <Navbar />
      <main className="flex-grow w-full px-4 py-8">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
} 
'use client';

import React from 'react';
import Navbar from '../Navbar';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow w-full px-4 py-8">
        {children}
      </main>
    </>
  );
} 
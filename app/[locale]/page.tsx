'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import for the Home component
const Home = dynamic(() => import('../components/Home'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  )
});

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    }>
      <Home />
    </Suspense>
  );
} 
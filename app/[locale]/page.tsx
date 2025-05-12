'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

// Use dynamic import for the Home component
const Home = dynamic(() => import('../components/Home'), {
  loading: () => <LoadingSpinner size="large" className="min-h-screen" />
});

export default function Page() {
  return (
    <PageTransition>
      <Suspense fallback={<LoadingSpinner size="large" className="min-h-screen" />}>
        <Home />
      </Suspense>
    </PageTransition>
  );
}
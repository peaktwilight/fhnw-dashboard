import { Suspense } from 'react';
import ClientHome from '@/app/components/ClientHome';

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    }>
      <ClientHome />
    </Suspense>
  );
} 
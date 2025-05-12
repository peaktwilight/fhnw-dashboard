'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { routeChangeTransition } from '../utils/animationUtils';

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={routeChangeTransition}
        className={className}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
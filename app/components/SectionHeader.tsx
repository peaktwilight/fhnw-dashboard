'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function SectionHeader({ title, subtitle, icon, rightElement }: SectionHeaderProps) {
  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1"
    >
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-orange-500 dark:text-orange-400"
        >
          {icon}
        </motion.div>
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white leading-none m-0">
            {title}
          </h2>
          {rightElement}
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-slate-600 dark:text-slate-400 ml-7 hidden sm:block"
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
} 
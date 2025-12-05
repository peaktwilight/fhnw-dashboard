'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/solid';

const buildId = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev';

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');

  const navLinks = [
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/campus`, label: 'Campus' },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/grades`, label: locale === 'de' ? 'Noten' : 'Grades' },
  ];

  return (
    <footer className="relative mt-auto border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-12 h-px bg-slate-200 dark:bg-slate-700" />

          {/* Made with love */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>{t('made_with')}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeartIcon className="w-4 h-4 text-red-500" />
              </motion.span>
              <a
                href="https://github.com/peaktwilight"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 dark:text-white hover:text-orange-500 transition-colors"
              >
                Doruk Tan Ozturk
              </a>
            </div>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>

            <a
              href="https://github.com/peaktwilight/fhnw-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>Open Source</span>
            </a>
          </div>

          {/* Copyright & Build Info */}
          <div className="flex flex-col items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <p>{t('copyright')}</p>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">
              Build: {buildId.slice(0, 7)}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

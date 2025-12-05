'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import {
  Squares2X2Icon,
  ChartBarIcon,
  HomeIcon,
  BuildingOffice2Icon,
  NewspaperIcon,
  Cog6ToothIcon,
  Bars2Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';

export default function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navbar');
  const [scrolled, setScrolled] = useState(false);

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'home': 'Home', 'grades': 'Grades', 'campus': 'Your FHNW Tools',
      'news': 'News', 'settings': 'Settings'
    };
    return fallbacks[key] || key;
  };

  const getTranslation = (key: string): string => {
    try { return t(key); } catch { return getFallbackTranslation(key); }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: getTranslation('home'), icon: HomeIcon, href: '/' },
    { name: getTranslation('grades'), href: '/grades', icon: ChartBarIcon },
    { name: getTranslation('campus'), icon: BuildingOffice2Icon, href: '/campus' },
    { name: getTranslation('news'), icon: NewspaperIcon, href: '/news' },
    { name: getTranslation('settings'), icon: Cog6ToothIcon, href: '/settings' }
  ];

  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-sm border-b border-slate-200 dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-1.5 group">
            <Squares2X2Icon className="w-8 h-8 text-orange-500 transition-transform duration-300 group-hover:rotate-12" />
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none text-slate-900 dark:text-white">FHNW</span>
              <span className="text-[11px] leading-none font-medium text-slate-400 dark:text-slate-500">Dashboard</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathWithoutLocale === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href === '/' ? '' : item.href}`}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

            <a
              href="https://github.com/peaktwilight/fhnw-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </div>

          {/* Mobile Menu */}
          <Menu as="div" className="relative md:hidden">
            {({ open }) => (
              <>
                <Menu.Button className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="sr-only">Open menu</span>
                  <AnimatePresence mode="wait">
                    {open ? (
                      <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                        <XMarkIcon className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                        <Bars2Icon className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-95 -translate-y-2"
                  enterTo="opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none overflow-hidden">
                    <div className="p-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathWithoutLocale === item.href;
                        return (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={`/${locale}${item.href === '/' ? '' : item.href}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                  isActive
                                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                    : active
                                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                                      : 'text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="https://github.com/peaktwilight/fhnw-dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </nav>
      </div>
    </header>
  );
}

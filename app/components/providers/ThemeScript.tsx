'use client';

import { useEffect } from 'react';

export function ThemeScript() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const root = document.documentElement;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      root.classList.remove('light', 'dark');
      root.classList.add(savedTheme);
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.remove('light', 'dark');
      root.classList.add(systemDark ? 'dark' : 'light');
    }
  }, []);

  return null;
} 
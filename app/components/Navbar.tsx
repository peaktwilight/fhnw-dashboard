'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

const navVariants = {
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

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

const logoVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5
    }
  }
};

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('weather-transport');
  const [highlightStyle, setHighlightStyle] = useState({});

  const scrollToSection = (id: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create an Intersection Observer to track which section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // Adjust the root margin to be more precise
        rootMargin: '-10% 0px -85% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    );

    // Update sections array to match page order and correct IDs
    const sections = ['transport', 'weather', 'menu', 'news', 'progress', 'map', 'events', 'links'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Calculate highlight position
  useEffect(() => {
    if (typeof window === 'undefined' || !activeSection) return;
    
    const calculateHighlightStyle = () => {
      const activeButton = document.querySelector(`[data-section="${activeSection}"]`);
      const container = document.querySelector('.relative');
      
      if (!activeButton || !container) return {};

      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setHighlightStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    };

    calculateHighlightStyle();
    window.addEventListener('resize', calculateHighlightStyle);
    
    return () => window.removeEventListener('resize', calculateHighlightStyle);
  }, [activeSection]);

  const menuItems = [
    {
      name: 'Transport',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16v-4a2 2 0 00-2-2H6l3.47-3.47a4 4 0 015.66 0L18.59 10H14a2 2 0 00-2 2v4m-5 0v1a2 2 0 002 2h6a2 2 0 002-2v-1m-5 0h5" />
        </svg>
      ),
      onClick: () => scrollToSection('transport'),
      sectionId: 'transport'
    },
    {
      name: 'Weather',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      onClick: () => scrollToSection('weather'),
      sectionId: 'weather'
    },
    {
      name: 'Menu',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      onClick: () => scrollToSection('menu'),
      sectionId: 'menu'
    },
    {
      name: 'News',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      onClick: () => scrollToSection('news'),
      sectionId: 'news'
    },
    {
      name: 'Progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: () => scrollToSection('progress'),
      sectionId: 'progress'
    },
    {
      name: 'Map',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      onClick: () => scrollToSection('map'),
      sectionId: 'map'
    },
    {
      name: 'Events',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => scrollToSection('events'),
      sectionId: 'events'
    },
    {
      name: 'Links',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      onClick: () => scrollToSection('links'),
      sectionId: 'links'
    }
  ];

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <motion.div
            whileHover="hover"
            variants={logoVariants}
          >
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:opacity-80 transition-opacity"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Squares2X2Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              FHNW Dashboard
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 relative">
            {/* Background highlight that moves smoothly */}
            <motion.div
              className="absolute h-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-blue-500/30"
              layoutId="navbar-highlight"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={highlightStyle}
            />

            {menuItems.map((item) => (
              <motion.button
                key={item.name}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={item.onClick}
                data-section={item.sectionId}
                className={`
                  flex items-center gap-1.5 px-3 py-2 text-sm transition-colors rounded-lg relative z-10
                  ${activeSection === item.sectionId 
                    ? 'text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }
                `}
              >
                <motion.div
                  className={`w-4 h-4 flex-shrink-0 flex items-center justify-center ${
                    activeSection === item.sectionId 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.div>
                <span className="hidden sm:inline leading-none">{item.name}</span>
              </motion.button>
            ))}

            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5 }}
              className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 sm:mx-2"
            />

            <motion.a
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              href="https://github.com/peaktwilight/fhnw-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </motion.a>
          </div>

          {/* Mobile Menu */}
          <Menu as="div" className="relative md:hidden">
            {({ open }) => (
              <>
                <Menu.Button className="p-2 text-purple-600 dark:text-purple-400">
                  <span className="sr-only">Open menu</span>
                  <motion.div
                    animate={open ? "open" : "closed"}
                    className="relative w-6 h-6 flex items-center justify-center"
                    initial="closed"
                  >
                    <motion.span
                      variants={{
                        closed: { rotate: 0, y: -6, width: 20 },
                        open: { rotate: 45, y: 0, width: 24 }
                      }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="absolute h-0.5 rounded-full transform origin-center bg-current"
                    />
                    <motion.span
                      variants={{
                        closed: { opacity: 1, x: 0, width: 16 },
                        open: { opacity: 0, x: -16 }
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute h-0.5 rounded-full bg-current"
                    />
                    <motion.span
                      variants={{
                        closed: { rotate: 0, y: 6, width: 20 },
                        open: { rotate: -45, y: 0, width: 24 }
                      }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="absolute h-0.5 rounded-full transform origin-center bg-current"
                    />
                  </motion.div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                    <div className="px-1 py-1">
                      {menuItems.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={item.onClick}
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <span className="mr-3">{item.icon}</span>
                              {item.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="https://github.com/peaktwilight/fhnw-dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
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
    </motion.header>
  );
} 
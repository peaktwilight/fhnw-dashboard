'use client';
import React from 'react';
import MenuDisplay from './components/MenuDisplay';

export default function Home() {
  const resources = [
    {
      icon: '🏛️',
      title: 'FHNW Homepage',
      description: 'Official website of FHNW',
      link: 'https://www.fhnw.ch'
    },
    {
      icon: '📚',
      title: 'Modulplaner',
      description: 'Plan and manage your modules',
      link: 'https://pub092.cs.technik.fhnw.ch/#/'
    },
    {
      icon: '🎓',
      title: 'StudentHub',
      description: 'Access student resources and information',
      link: 'https://studenthub.technik.fhnw.ch/#/student'
    },
    {
      icon: '📅',
      title: 'Auxilium Timetable',
      description: 'Check your class schedule',
      link: 'https://auxilium.webapps.fhnw.ch/student/timetable'
    },
    {
      icon: '📊',
      title: 'Grades',
      description: 'View your grades',
      link: 'https://auxilium.webapps.fhnw.ch/student/noten'
    },
    {
      icon: '📖',
      title: 'Moodle',
      description: 'Access your course materials',
      link: 'https://moodle.fhnw.ch/login/index.php'
    },
    {
      icon: '🏢',
      title: 'Room Reservation',
      description: 'Book rooms and facilities',
      link: 'https://raum.fhnw.ch/'
    },
    {
      icon: '✍️',
      title: 'ESP Registration',
      description: 'Register for courses',
      link: 'https://esp.technik.fhnw.ch/Views/Register.aspx'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="py-12 mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          FHNW Student Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your one-stop hub for all FHNW resources and daily menu updates
        </p>
      </div>

      {/* Menu Section with subtle background */}
      <div className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-sm mb-16">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] rounded-3xl"></div>
        <div className="relative z-10">
          <MenuDisplay />
        </div>
      </div>

      {/* Divider with icon */}
      <div className="relative py-8 mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full text-lg font-medium text-gray-900 dark:text-gray-100 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Links
          </span>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{resource.icon}</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {resource.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {resource.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 
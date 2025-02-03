'use client';
import React from 'react';
import MenuDisplay from './components/MenuDisplay';
import WeatherWidget from './components/WeatherWidget';
import StationBoard from './components/StationBoard';
import SectionHeader from './components/SectionHeader';

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
    <main className="container mx-auto p-4 space-y-12">
      {/* Weather & Transport Section */}
      <div id="weather-transport" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <SectionHeader
              title="Weather"
              subtitle="Current weather in Brugg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              }
            />
            <WeatherWidget />
          </div>
          <div className="space-y-4">
            <SectionHeader
              title="Transport"
              subtitle="Train departures from Brugg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16v-4a2 2 0 00-2-2H6l3.47-3.47a4 4 0 015.66 0L18.59 10H14a2 2 0 00-2 2v4m-5 0v1a2 2 0 002 2h6a2 2 0 002-2v-1m-5 0h5" />
                </svg>
              }
            />
            <StationBoard />
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <section id="menu" className="space-y-4">
        <SectionHeader
          title="Today's Menu"
          subtitle="FHNW Mensa daily offerings"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <MenuDisplay />
      </section>

      {/* Quick Links Section */}
      <section id="links" className="space-y-4">
        <SectionHeader
          title="Quick Links"
          subtitle="Frequently used FHNW resources"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{resource.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {resource.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
} 
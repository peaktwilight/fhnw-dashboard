'use client';
import React from 'react';

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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        FHNW Student Resources
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center p-6">
              <span className="text-4xl mb-4">{resource.icon}</span>
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
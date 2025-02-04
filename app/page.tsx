'use client';
import React from 'react';
import { motion } from 'framer-motion';
import MenuDisplay from './components/MenuDisplay';
import WeatherWidget from './components/WeatherWidget';
import StationBoard from './components/StationBoard';
import SectionHeader from './components/SectionHeader';
import RegistrationWidget from './components/RegistrationWidget';
import MapWidget from './components/MapWidget';
import NewsWidget from './components/NewsWidget';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

// Update the LiveIndicator component
const LiveIndicator = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="inline-flex items-center h-5 px-1.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-green-100 dark:bg-green-900/30 ml-2 text-green-700 dark:text-green-300"
  >
    <motion.div
      className="w-1.5 h-1.5 mr-1 rounded-full bg-green-500 dark:bg-green-400"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    Live
  </motion.div>
);

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
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-4 space-y-12"
    >
      {/* Weather & Transport Section */}
      <motion.div 
        variants={sectionVariants}
        id="weather-transport" 
        className="space-y-4"
      >
        {/* Weather */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex flex-col gap-1">
            <SectionHeader
              title="Weather"
              subtitle="Current weather in Brugg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              }
              rightElement={<LiveIndicator />}
            />
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeatherWidget />
            </motion.div>
          </div>
        </motion.div>

        {/* Transport */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <div className="flex flex-col gap-1">
            <SectionHeader
              title="Transport"
              subtitle="Train departures from Brugg station"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16v-4a2 2 0 00-2-2H6l3.47-3.47a4 4 0 015.66 0L18.59 10H14a2 2 0 00-2 2v4m-5 0v1a2 2 0 002 2h6a2 2 0 002-2v-1m-5 0h5" />
                </svg>
              }
              rightElement={<LiveIndicator />}
            />
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StationBoard />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* News Section */}
      <motion.section 
        variants={sectionVariants}
        id="news" 
        className="space-y-4"
      >
        <SectionHeader
          title="FHNW News"
          subtitle="Latest updates from FHNW"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
          rightElement={<LiveIndicator />}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <NewsWidget />
        </motion.div>
      </motion.section>

      {/* Menu Section */}
      <motion.section 
        variants={sectionVariants}
        id="menu" 
        className="space-y-4"
      >
        <div className="flex flex-col gap-1">
          <SectionHeader
            title="Today's Menu"
            subtitle="FHNW Mensa daily offerings"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            rightElement={<LiveIndicator />}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MenuDisplay />
          </motion.div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section 
        variants={sectionVariants}
        id="map" 
        className="space-y-4"
      >
        <SectionHeader
          title="Campus Map"
          subtitle="FHNW Campus Brugg-Windisch location"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <MapWidget />
        </motion.div>
      </motion.section>

      {/* Registrations Section */}
      <motion.section 
        variants={sectionVariants}
        id="registrations" 
        className="space-y-4"
      >
        <SectionHeader
          title="Semester Progress Tracker"
          subtitle="Visualize your grades, modules, and academic journey at FHNW"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <RegistrationWidget />
        </motion.div>
      </motion.section>

      {/* Quick Links Section */}
      <motion.section 
        variants={sectionVariants}
        id="links" 
        className="space-y-4"
      >
        <SectionHeader
          title="Quick Links"
          subtitle="Frequently used FHNW resources"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {resources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.span 
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {resource.icon}
                </motion.span>
                <motion.h3 
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {resource.title}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {resource.description}
                </motion.p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.section>
    </motion.main>
  );
} 
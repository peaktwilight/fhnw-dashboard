'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Registration {
  modulanlassAnmeldungId: number;
  modulanlassId: number;
  studierendeId: number;
  statusId: number;
  statusName: string;
  freieNote: number | null;
  noteId: number | null;
  titelArbeit: string | null;
  text: string;
  anmeldungsDatum: string;
  hochschule: string;
  ausbildungsart: number;
  modulanlass: {
    modulanlassId: number;
    modulId: number;
    nummer: string;
    bezeichnung: string;
    statusId: number;
    statusName: string;
    hochschule: string;
    ausbildungsart: number;
    maxTeilnehmende: number;
    datumVon: string;
    datumBis: string;
    wochentag: string | null;
    zeitVon: string | null;
    zeitBis: string | null;
    anzahlAnmeldung: number;
    anlassleitungen: {
      leitungsperson: {
        leitungspersonId: number;
        vorname: string;
        nachname: string;
        email: string;
        telefon: string | null;
      };
      leitungsrolleId: number;
      leitungsrolleBezeichnung: string;
    }[];
  };
  bestanden: boolean | null;
  noteBezeichnung: string | null;
}

interface GradeDistribution {
  range: string;
  count: number;
  color: string;
}

interface ModuleProgress {
  completed: number;
  inProgress: number;
  total: number;
  percentage: number;
}

// Add these animation variants near the top with other variants
const tutorialStepVariants = {
  hidden: { 
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export default function RegistrationWidget() {
  const [jsonInput, setJsonInput] = useState('');
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Registration | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'completed' | 'current'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load saved data from localStorage when component mounts
    const savedData = localStorage.getItem('studenthub_registrations');
    const savedTimestamp = localStorage.getItem('studenthub_last_updated');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setRegistrations(parsed);
        setShowJsonInput(false);
        if (savedTimestamp) {
          setLastUpdated(savedTimestamp);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Check for token in URL hash and store it in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        localStorage.setItem('studenthub_token', `Bearer ${accessToken}`);
        // Clean the URL and reload the page for a fresh start with the token stored
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
      }
    }
  }, []);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedModule(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    window.open('https://studenthub.technik.fhnw.ch/#/student', '_blank');
  };

  const handleOpenAnmeldungen = () => {
    window.open('https://studenthub.technik.fhnw.ch/api/studenthub/anmeldungen', '_blank');
  };

  const handleParseJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        // Save to localStorage
        localStorage.setItem('studenthub_registrations', JSON.stringify(parsed));
        const timestamp = new Date().toISOString();
        localStorage.setItem('studenthub_last_updated', timestamp);
        
        setRegistrations(parsed);
        setLastUpdated(timestamp);
        setError(null);
        setShowJsonInput(false);
      } else {
        setError('Invalid JSON: Expected an array of registrations.');
      }
    } catch {
      setError('Invalid JSON format.');
    }
  };

  const completed = registrations?.filter(r => r.freieNote !== null) || [];
  const current = registrations?.filter(r => r.freieNote === null) || [];

  // Calculate statistics
  const stats = registrations ? {
    totalModules: registrations.length,
    completedModules: completed.length,
    currentModules: current.length,
    averageGrade: completed.length > 0 
      ? (completed.reduce((sum, reg) => sum + (reg.freieNote || 0), 0) / completed.length).toFixed(2)
      : null,
    passedModules: completed.filter(reg => reg.freieNote && reg.freieNote >= 4).length,
    totalStudents: registrations.reduce((max, reg) => Math.max(max, reg.modulanlass.anzahlAnmeldung), 0),
    uniqueLecturers: new Set(registrations.flatMap(reg => 
      reg.modulanlass.anlassleitungen.map(l => l.leitungsperson.leitungspersonId)
    )).size,
    departments: new Set(registrations.map(reg => reg.hochschule)).size,
    totalCapacity: registrations.reduce((sum, reg) => sum + reg.modulanlass.maxTeilnehmende, 0),
    earliestModule: new Date(Math.min(...registrations.map(reg => new Date(reg.modulanlass.datumVon).getTime()))),
    latestModule: new Date(Math.max(...registrations.map(reg => new Date(reg.modulanlass.datumBis).getTime()))),
  } : null;

  // Calculate grade distribution
  const getGradeDistribution = (grades: number[]): GradeDistribution[] => {
    const ranges = [
      { min: 5.5, max: 6.0, label: '5.5-6.0', color: 'bg-green-500' },
      { min: 5.0, max: 5.4, label: '5.0-5.4', color: 'bg-green-400' },
      { min: 4.5, max: 4.9, label: '4.5-4.9', color: 'bg-green-300' },
      { min: 4.0, max: 4.4, label: '4.0-4.4', color: 'bg-green-200' },
      { min: 3.5, max: 3.9, label: '3.5-3.9', color: 'bg-red-300' },
      { min: 1.0, max: 3.4, label: '1.0-3.4', color: 'bg-red-500' },
    ];

    return ranges.map(range => ({
      range: range.label,
      count: grades.filter(g => g >= range.min && g <= range.max).length,
      color: range.color
    }));
  };

  // Calculate module progress
  const getModuleProgress = (): ModuleProgress => {
    if (!registrations) return { completed: 0, inProgress: 0, total: 0, percentage: 0 };
    
    const total = registrations.length;
    const completed = registrations.filter(r => r.freieNote !== null).length;
    const inProgress = total - completed;
    const percentage = (completed / total) * 100;

    return { completed, inProgress, total, percentage };
  };

  // Filter modules based on search term
  const filterModules = (modules: Registration[]) => {
    if (!searchTerm) return modules;
    const term = searchTerm.toLowerCase();
    return modules.filter(
      mod => mod.modulanlass.bezeichnung.toLowerCase().includes(term) ||
             mod.modulanlass.nummer.toLowerCase().includes(term) ||
             mod.modulanlass.anlassleitungen.some(
               l => l.leitungsperson.vorname.toLowerCase().includes(term) ||
                    l.leitungsperson.nachname.toLowerCase().includes(term)
             )
    );
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Get all grades for distribution
  const grades = completed.map(r => r.freieNote).filter((g): g is number => g !== null);
  const gradeDistribution = getGradeDistribution(grades);
  const moduleProgress = getModuleProgress();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Module Overview
            </h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {registrations && !showJsonInput && (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowJsonInput(true)}
                className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Data
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* JSON Input Section - Collapsible */}
      <AnimatePresence>
        {showJsonInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-lg mb-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How to Get Your Module Data
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Log in to StudentHub",
                      description: "First, click the button below to open StudentHub in a new tab. Log in with your FHNW account if you're not already logged in.",
                      action: (
                        <motion.button
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleLogin}
                          className="mt-2 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                        >
                          <span>Open StudentHub</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </motion.button>
                      )
                    },
                    {
                      step: 2,
                      title: "Get Your Module Data",
                      description: "After logging in, click the button below to view your module data in a new tab:",
                      action: (
                        <motion.button
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleOpenAnmeldungen}
                          className="mt-2 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                        >
                          <span>View Module Data</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </motion.button>
                      ),
                      note: (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-3 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
                        >
                          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            <span className="font-medium">Important:</span> You should see a page with a lot of text that starts with <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">[{"{"}...</code> and ends with <code className="bg-yellow-100 dark:bg-yellow-800 px-1 py-0.5 rounded">...{"}"}]</code>
                          </p>
                          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                            If you see an error message instead, go back to step 1 and make sure you&apos;re logged in.
                          </p>
                        </motion.div>
                      )
                    },
                    {
                      step: 3,
                      title: "Copy Everything",
                      description: "Select all the text on the page using:",
                      shortcuts: [
                        { os: "Windows", keys: ["Ctrl", "A"] },
                        { os: "Mac", keys: ["⌘", "A"] }
                      ]
                    },
                    {
                      step: 4,
                      title: "Paste & Load",
                      description: "Paste the copied data in the box below using:",
                      shortcuts: [
                        { os: "Windows", keys: ["Ctrl", "V"] },
                        { os: "Mac", keys: ["⌘", "V"] }
                      ]
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={step.step}
                      variants={tutorialStepVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 relative"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold shadow-sm">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-800 dark:text-blue-200 font-medium">{step.title}</p>
                        <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
                          {step.description}
                        </p>
                        {step.shortcuts && (
                          <div className="mt-2 flex flex-wrap gap-3">
                            {step.shortcuts.map(shortcut => (
                              <div key={shortcut.os} className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                                <span>{shortcut.os}:</span>
                                {shortcut.keys.map((key, keyIndex) => (
                                  <React.Fragment key={key}>
                                    <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded shadow">
                                      {key}
                                    </kbd>
                                    {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        {step.action}
                        {step.note}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                    rows={8}
                    placeholder="Paste your module data here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleParseJSON}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span>Load Data</span>
                  </motion.button>
                </div>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {registrations && (
        <>
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex p-4 min-w-full md:min-w-0">
              <div className="flex space-x-2 md:space-x-4 w-full md:w-auto">
                {['overview', 'completed', 'current'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as 'overview' | 'completed' | 'current')}
                    className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out flex-1 md:flex-none whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Search Bar */}
          {activeTab !== 'overview' && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search modules, lecturers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

          {/* Content Sections */}
          {activeTab === 'overview' && stats && (
            <>
              {/* Enhanced Statistics Dashboard */}
              <div className="p-6 space-y-6 border-b border-gray-200 dark:border-gray-700">
                {/* Main Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Modules', value: stats.totalModules },
                    { label: 'Completed', value: stats.completedModules },
                    { label: 'Average Grade', value: stats.averageGrade || '-' },
                    { 
                      label: 'Pass Rate', 
                      value: stats.completedModules > 0 
                        ? `${Math.round((stats.passedModules / stats.completedModules) * 100)}%`
                        : '-'
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        {stat.label}
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                      >
                        {stat.value}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Study Progress</h4>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <motion.span 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:text-blue-200 dark:bg-blue-900"
                        >
                          Progress
                        </motion.span>
                      </div>
                      <div className="text-right">
                        <motion.span 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-200"
                        >
                          {moduleProgress.percentage.toFixed(1)}%
                        </motion.span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${moduleProgress.percentage}%` }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        {moduleProgress.completed} Completed
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        {moduleProgress.inProgress} In Progress
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        {moduleProgress.total} Total
                      </motion.span>
                    </div>
                  </div>
                </motion.div>

                {/* Grade Distribution */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Grade Distribution</h4>
                  <div className="space-y-3">
                    {gradeDistribution.map((grade, index) => (
                      <div key={grade.range} className="relative">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                          className="flex justify-between mb-1"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{grade.range}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{grade.count}</span>
                        </motion.div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(grade.count / grades.length) * 100}%` }}
                            transition={{ delay: 1.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                            className={`h-2.5 rounded-full ${grade.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Course Information</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Total Students', value: stats.totalStudents },
                        { label: 'Total Capacity', value: stats.totalCapacity },
                        { label: 'Unique Lecturers', value: stats.uniqueLecturers },
                        { label: 'Departments', value: stats.departments }
                      ].map((item, index) => (
                        <motion.div 
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.6 + index * 0.1 }}
                          className="flex justify-between"
                        >
                          <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                          <span className="text-gray-900 dark:text-white font-medium">{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Timeline</h4>
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                      >
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Study Period</p>
                        <p className="text-gray-900 dark:text-white">
                          {stats.earliestModule.toLocaleDateString()} — {stats.latestModule.toLocaleDateString()}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                      >
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Current Status</p>
                        <div className="mt-1 flex space-x-2">
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.8 }}
                            className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2"
                          >
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              {current.length} Active
                            </p>
                          </motion.div>
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.9 }}
                            className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-lg p-2"
                          >
                            <p className="text-sm text-green-800 dark:text-green-200">
                              {stats.passedModules} Passed
                            </p>
                          </motion.div>
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2.0 }}
                            className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-lg p-2"
                          >
                            <p className="text-sm text-red-800 dark:text-red-200">
                              {completed.length - stats.passedModules} Failed
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'completed' && (
            <div className="p-6">
              <div className="space-y-3">
                {filterModules(completed).map((reg, index) => (
                  <motion.button
                    key={reg.modulanlassAnmeldungId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedModule(reg)}
                    className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  >
                    <motion.div 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                      layoutId={`module-${reg.modulanlassAnmeldungId}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {reg.modulanlass.bezeichnung}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {reg.modulanlass.anlassleitungen[0]?.leitungsperson.vorname}{' '}
                          {reg.modulanlass.anlassleitungen[0]?.leitungsperson.nachname}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{new Date(reg.modulanlass.datumVon).toLocaleDateString()}</span>
                          <span className="mx-2">—</span>
                          <span>{new Date(reg.modulanlass.datumBis).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <motion.div 
                        className={`ml-4 px-3 py-1 rounded-full ${
                          reg.freieNote && reg.freieNote >= 4
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {reg.freieNote?.toFixed(1)}
                      </motion.div>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'current' && (
            <div className="p-6">
              <div className="space-y-3">
                {filterModules(current).map((reg, index) => (
                  <motion.button
                    key={reg.modulanlassAnmeldungId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedModule(reg)}
                    className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  >
                    <motion.div 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                      layoutId={`module-${reg.modulanlassAnmeldungId}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {reg.modulanlass.bezeichnung}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {reg.modulanlass.anlassleitungen[0]?.leitungsperson.vorname}{' '}
                          {reg.modulanlass.anlassleitungen[0]?.leitungsperson.nachname}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Registered: {new Date(reg.anmeldungsDatum).toLocaleDateString()}</span>
                        </div>
                        {reg.modulanlass.wochentag && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{reg.modulanlass.wochentag} {reg.modulanlass.zeitVon} - {reg.modulanlass.zeitBis}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div 
              ref={modalRef}
              variants={modalVariants}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    {selectedModule.modulanlass.bezeichnung}
                  </motion.h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedModule(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 space-y-4"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Module Details</h4>
                  <p className="text-gray-900 dark:text-white mt-1">Number: {selectedModule.modulanlass.nummer}</p>
                  <p className="text-gray-900 dark:text-white">Status: {selectedModule.statusName}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedModule.modulanlass.anzahlAnmeldung}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedModule.modulanlass.maxTeilnehmende}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fill Rate</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {Math.round((selectedModule.modulanlass.anzahlAnmeldung / selectedModule.modulanlass.maxTeilnehmende) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Schedule</h4>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(selectedModule.modulanlass.datumVon).toLocaleDateString()} — 
                    {new Date(selectedModule.modulanlass.datumBis).toLocaleDateString()}
                  </p>
                  {selectedModule.modulanlass.wochentag && (
                    <p className="text-gray-900 dark:text-white">
                      {selectedModule.modulanlass.wochentag} {selectedModule.modulanlass.zeitVon} - {selectedModule.modulanlass.zeitBis}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructors</h4>
                  <div className="mt-1 space-y-2">
                    {selectedModule.modulanlass.anlassleitungen.map((leitung, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">
                            {leitung.leitungsperson.vorname} {leitung.leitungsperson.nachname}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {leitung.leitungsrolleBezeichnung}
                          </p>
                          <a
                            href={`mailto:${leitung.leitungsperson.email}`}
                            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {leitung.leitungsperson.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedModule.freieNote !== null && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Grade</h4>
                    <div className={`inline-block mt-1 px-3 py-1 rounded-full ${
                      selectedModule.freieNote >= 4
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                    }`}>
                      {selectedModule.freieNote.toFixed(1)}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Registration, ManualGrade, buttonVariants } from '../types/modules';
import { calculateStats } from '../utils/moduleUtils';

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

// Import the new components
import ModuleDataImport from './modules/ModuleDataImport';
import ModuleOverview from './modules/ModuleOverview';
import ModuleList from './modules/ModuleList';
import ModuleDetailModal from './modules/ModuleDetailModal';
import GradeManager from './modules/GradeManager';

const tabs = [
  { id: 'grade-manager', label: 'Grades', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )},
  { id: 'overview', label: 'Overview', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )},
  { id: 'current', label: 'Current Modules', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { id: 'completed', label: 'Completed', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )}
] as const;

export default function RegistrationWidget() {
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Registration | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('grade-manager');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleDataImported = (data: Registration[]) => {
    setRegistrations(data);
    setLastUpdated(new Date().toISOString());
    setShowJsonInput(false);
    // Save to localStorage
    localStorage.setItem('studenthub_registrations', JSON.stringify(data));
    localStorage.setItem('studenthub_last_updated', new Date().toISOString());
  };

  const handleUpdateRegistration = (updatedModule: Registration) => {
    setRegistrations(prev => {
      if (!prev) return null;
      const updated = prev.map(reg =>
        reg.modulanlassAnmeldungId === updatedModule.modulanlassAnmeldungId
          ? updatedModule
          : reg
      );
        // Save to localStorage
      localStorage.setItem('studenthub_registrations', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddManualGrade = (grade: ManualGrade) => {
    // Create a new Registration object for the manual grade
    const manualRegistration: Registration = {
      modulanlassAnmeldungId: Date.now(), // Use timestamp as unique ID
      modulanlassId: -1,
      studierendeId: -1,
      statusId: 1,
      statusName: "Manual Entry",
      freieNote: grade.grade,
      noteId: null,
      titelArbeit: null,
      text: "Manual grade entry",
      anmeldungsDatum: new Date().toISOString(),
      hochschule: "Manual",
      ausbildungsart: 0,
      moduleType: {
        type: grade.type,
        weight: grade.weight,
        ects: grade.ects
      },
      groupName: grade.moduleName,
      modulanlass: {
        modulanlassId: -1,
        modulId: -1,
        nummer: "MANUAL",
        bezeichnung: grade.moduleName,
        statusId: 1,
        statusName: "Manual Entry",
        hochschule: "Manual",
        ausbildungsart: 0,
        maxTeilnehmende: 1,
        datumVon: new Date().toISOString(),
        datumBis: new Date().toISOString(),
        wochentag: null,
        zeitVon: null,
        zeitBis: null,
        anzahlAnmeldung: 1,
        anlassleitungen: []
      },
      bestanden: grade.grade >= 4,
      noteBezeichnung: grade.grade.toString()
    };

    setRegistrations(prev => {
      if (!prev) return [manualRegistration];
      const updated = [...prev, manualRegistration];
      // Save to localStorage
      localStorage.setItem('studenthub_registrations', JSON.stringify(updated));
      return updated;
    });
  };

  const handleExportData = () => {
    if (registrations) {
      const dataStr = JSON.stringify(registrations, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `module-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = calculateStats(registrations);
  const completed = registrations?.filter(r => r.freieNote !== null) || [];
  const current = registrations?.filter(r => r.freieNote === null) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
      {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Grade Progress Dashboard
                </h1>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {registrations && !showJsonInput && (
                  <>
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                      onClick={handleExportData}
                      className="text-sm px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                      Export
              </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                      onClick={() => setShowJsonInput(true)}
                      className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                      Update
                        </motion.button>
                  </>
                )}
                      </div>
                              </div>
                          </div>

          {/* JSON Input Section - Collapsible */}
          <AnimatePresence>
            {showJsonInput && (
              <ModuleDataImport 
                onDataImported={handleDataImported} 
              />
            )}
          </AnimatePresence>

          {registrations && (
            <>
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                {/* Mobile Menu Button */}
                <div className="md:hidden px-4 py-2">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="flex items-center gap-2">
                      {tabs.find(tab => tab.id === activeTab)?.icon}
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Mobile Menu */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                        className="mt-2 space-y-1"
                      >
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                              activeTab === tab.id
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {tab.icon}
                            {tab.label}
                          </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

                {/* Desktop Tabs */}
                <nav className="hidden md:flex p-4">
                  <div className="flex space-x-4">
                    {tabs.map((tab) => (
                  <button
                    key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                    }`}
                  >
                        {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Search Bar */}
              {activeTab !== 'overview' && activeTab !== 'grade-manager' && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative max-w-md mx-auto">
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
              <div className="p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                    key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <ModuleOverview stats={stats} registrations={registrations} />
                    )}

                    {activeTab === 'completed' && (
                      <ModuleList 
                        modules={completed} 
                        searchTerm={searchTerm} 
                        onSelectModule={setSelectedModule} 
                      />
          )}

          {activeTab === 'current' && (
                      <ModuleList 
                        modules={current} 
                        searchTerm={searchTerm} 
                        onSelectModule={setSelectedModule} 
                      />
          )}

          {activeTab === 'grade-manager' && (
                      <GradeManager 
                        registrations={registrations}
                        onUpdateRegistration={handleUpdateRegistration}
                        onAddManualGrade={handleAddManualGrade}
                      />
                    )}
                        </motion.div>
                </AnimatePresence>
                    </div>
        </>
      )}

          {/* Module Detail Modal */}
          <ModuleDetailModal 
            module={selectedModule} 
            onClose={() => setSelectedModule(null)} 
          />
            </motion.div>
              </div>
                </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Registration, ManualGrade, buttonVariants } from '../types/modules';
import { calculateStats } from '../utils/moduleUtils';

// Import the new components
import ModuleDataImport from './modules/ModuleDataImport';
import ModuleOverview from './modules/ModuleOverview';
import ModuleList from './modules/ModuleList';
import ModuleDetailModal from './modules/ModuleDetailModal';
import GradeManager from './modules/GradeManager';

export default function RegistrationWidget() {
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Registration | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'completed' | 'current' | 'grade-manager'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = calculateStats(registrations);
  const completed = registrations?.filter(r => r.freieNote !== null) || [];
  const current = registrations?.filter(r => r.freieNote === null) || [];

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
              <>
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                  onClick={handleExportData}
                  className="text-sm px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                  Export Data
              </motion.button>
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
            lastUpdated={lastUpdated} 
          />
        )}
      </AnimatePresence>

      {registrations && (
        <>
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex p-4 min-w-full md:min-w-0">
              <div className="flex space-x-2 md:space-x-4 w-full md:w-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'current', label: 'Current' },
                  { id: 'grade-manager', label: 'Grade Manager' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'completed' | 'current' | 'grade-manager')}
                    className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out flex-1 md:flex-none whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Search Bar */}
          {activeTab !== 'overview' && activeTab !== 'grade-manager' && (
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
        </>
      )}

      {/* Module Detail Modal */}
      <ModuleDetailModal 
        module={selectedModule} 
        onClose={() => setSelectedModule(null)} 
      />
                </div>
  );
}

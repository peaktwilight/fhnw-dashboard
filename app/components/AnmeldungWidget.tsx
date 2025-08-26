'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface AnmeldungData {
  anlassId: number;
  anlassTyp: string;
  anlassTypId: number;
  anmeldungId: number;
  bezeichnung: string;
  datumBis: string;
  datumVon: string;
  nummer: string;
  personId: number;
  semester: string;
  semesterId: number;
  status: string;
  statusId: number;
  statusType: number;
  ects: string | null;
}

interface ApiResponse {
  '@odata.context': string;
  value: AnmeldungData[];
}

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AnmeldungWidget() {
  const t = useTranslations('grades');

  const [anmeldungen, setAnmeldungen] = useState<AnmeldungData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const getFallbackTranslation = (key: string): string => {
    const fallbacks: Record<string, string> = {
      'registrations_title': 'My Course Registrations',
      'fetch_data': 'Fetch Data',
      'last_updated': 'Last updated',
      'no_token': 'Please authenticate first',
      'loading': 'Loading...',
      'error_occurred': 'An error occurred',
      'module_code': 'Module Code',
      'module_name': 'Module Name',
      'semester': 'Semester',
      'status': 'Status',
      'ects': 'ECTS',
      'date_range': 'Date Range',
      'no_data': 'No registrations found',
      'enter_token': 'Enter Token',
      'token_placeholder': 'Paste your Bearer token here',
      'save_token': 'Save Token',
      'token_instructions': 'Get your token from browser DevTools',
      'change_token': 'Change Token'
    };
    return fallbacks[key] || key;
  };

  const getTranslation = (key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  };


  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('fhnw_token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setShowTokenInput(true);
    }

    // Load cached data
    const cachedData = localStorage.getItem('anmeldung_data');
    const cachedTimestamp = localStorage.getItem('anmeldung_last_updated');
    if (cachedData) {
      try {
        setAnmeldungen(JSON.parse(cachedData));
        if (cachedTimestamp) {
          setLastUpdated(cachedTimestamp);
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    }
  }, []);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      const cleanToken = tokenInput.trim();
      const formattedToken = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;
      setToken(formattedToken);
      localStorage.setItem('fhnw_token', formattedToken);
      setShowTokenInput(false);
      setTokenInput('');
    }
  };

  const fetchAnmeldungen = async () => {
    if (!token) {
      setError(getTranslation('no_token'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current semester (e.g., 20242 for autumn 2024)
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const semesterId = currentMonth >= 7 ? `${currentYear}2` : `${currentYear}1`; // 2 for autumn, 1 for spring

      // Use our proxy API route instead of calling FHNW directly
      const url = new URL('/api/anmeldung', window.location.origin);
      url.searchParams.append('semesterId', semesterId);
      url.searchParams.append('top', '100');
      url.searchParams.append('statusType', '100005');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setAnmeldungen(data.value);
      
      const timestamp = new Date().toISOString();
      setLastUpdated(timestamp);

      // Cache the data
      localStorage.setItem('anmeldung_data', JSON.stringify(data.value));
      localStorage.setItem('anmeldung_last_updated', timestamp);

    } catch (err) {
      setError(err instanceof Error ? err.message : getTranslation('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotalECTS = () => {
    return anmeldungen
      .filter(a => a.ects && a.ects !== null)
      .reduce((total, a) => total + parseFloat(a.ects || '0'), 0);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {getTranslation('registrations_title')}
            </h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {getTranslation('last_updated')}: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {token && (
              <motion.button
                variants={itemVariants}
                onClick={() => setShowTokenInput(true)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                {getTranslation('change_token')}
              </motion.button>
            )}
            <motion.button
              variants={itemVariants}
              onClick={fetchAnmeldungen}
              disabled={loading || !token}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {getTranslation('loading')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {getTranslation('fetch_data')}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Token Input Section */}
      <AnimatePresence>
        {showTokenInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {getTranslation('enter_token')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {getTranslation('token_instructions')}:
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                  <p>1. Go to <a href="https://auxilium.webapps.fhnw.ch/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">auxilium.webapps.fhnw.ch</a></p>
                  <p>2. Open browser DevTools (F12)</p>
                  <p>3. Go to Network tab</p>
                  <p>4. Navigate to your registrations</p>
                  <p>5. Find the API request to &quot;Anmeldung&quot;</p>
                  <p>6. Copy the Authorization header value</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={getTranslation('token_placeholder')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveToken}
                  disabled={!tokenInput.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {getTranslation('save_token')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="p-6">
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {!token && (
          <motion.div
            variants={itemVariants}
            className="text-center py-8"
          >
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">{getTranslation('no_token')}</p>
          </motion.div>
        )}

        {anmeldungen.length > 0 && (
          <>
            {/* Statistics */}
            <motion.div variants={itemVariants} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{anmeldungen.length}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Registrations</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{calculateTotalECTS()}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Total ECTS</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {new Set(anmeldungen.map(a => a.semester)).size}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Semesters</div>
              </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={itemVariants} className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {getTranslation('module_code')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {getTranslation('module_name')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {getTranslation('semester')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {getTranslation('status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {getTranslation('ects')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {getTranslation('date_range')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {anmeldungen.map((anmeldung) => (
                    <tr key={anmeldung.anmeldungId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {anmeldung.nummer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {anmeldung.bezeichnung}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {anmeldung.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {anmeldung.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {anmeldung.ects || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(anmeldung.datumVon)} - {formatDate(anmeldung.datumBis)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}

        {anmeldungen.length === 0 && !loading && !error && token && (
          <motion.div
            variants={itemVariants}
            className="text-center py-8"
          >
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">{getTranslation('no_data')}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
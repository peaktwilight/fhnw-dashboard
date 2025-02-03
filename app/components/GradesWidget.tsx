'use client';
import React, { useState, useEffect } from 'react';

interface ModuleGrade {
  modulanlassAnmeldungId: number;
  freieNote: number | null;
  bestanden: boolean | null;
  noteBezeichnung: string | null;
  modulanlass: {
    bezeichnung: string;
    statusName: string;
    datumVon: string;
    datumBis: string;
    anlassleitungen: Array<{
      leitungsperson: {
        vorname: string;
        nachname: string;
        email: string;
      };
    }>;
  };
}

export default function GradesWidget() {
  const [grades, setGrades] = useState<ModuleGrade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for token in URL hash and store it in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        console.log('Client: Access token found in URL hash:', accessToken);
        localStorage.setItem('studenthub_token', `Bearer ${accessToken}`);
        // Clean the URL and reload the page for a fresh start with the token stored
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
      }
    }
  }, []);

  const handleLogin = () => {
    window.location.href = 'https://studenthub.technik.fhnw.ch/#/student';
  };

  useEffect(() => {
    if (!mounted) return;

    const fetchGrades = async () => {
      try {
        // Retrieve token from localStorage and log it
        const token = localStorage.getItem('studenthub_token');
        console.log('Client: Using token from localStorage:', token);

        const headers: HeadersInit = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = token;
        } else {
          console.log('Client: No token found in localStorage');
        }

        const response = await fetch('/api/grades', { headers });
        const data = await response.json();

        if (!response.ok) {
          console.log('Client: API response not OK:', response.status, data);
          if (response.status === 401 || data.requiresLogin) {
            setRequiresLogin(true);
            setError('Please log in to StudentHub to view your grades');
          } else {
            setError(data.error || 'Failed to fetch grades');
          }
          return;
        }

        console.log('Client: Fetched grades data:', data);
        setGrades(data);
        setError(null);
        setRequiresLogin(false);
      } catch (err) {
        console.error('Client: Error fetching grades:', err);
        setError('Failed to fetch grades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [mounted]);

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

  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          {requiresLogin && (
            <div className="mt-4 space-y-4">
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <span>Open StudentHub</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                After logging in to StudentHub, return here and click refresh
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Separate grades into completed and current modules
  const gradedModules = grades.filter((grade) => grade.freieNote !== null);
  const currentModules = grades.filter((grade) => grade.freieNote === null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
      {/* Completed Modules */}
      {gradedModules.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Completed Modules
          </h3>
          <div className="space-y-3">
            {gradedModules.map((grade) => (
              <div
                key={grade.modulanlassAnmeldungId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {grade.modulanlass.bezeichnung.split(' ').slice(0, -1).join(' ')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {grade.modulanlass.anlassleitungen[0]?.leitungsperson.vorname}{' '}
                    {grade.modulanlass.anlassleitungen[0]?.leitungsperson.nachname}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${
                    grade.freieNote && grade.freieNote >= 4
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                  }`}
                >
                  {grade.freieNote?.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Semester Modules */}
      {currentModules.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Current Semester
          </h3>
          <div className="space-y-3">
            {currentModules.map((module) => (
              <div
                key={module.modulanlassAnmeldungId}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {module.modulanlass.bezeichnung.split(' ').slice(0, -1).join(' ')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {module.modulanlass.anlassleitungen[0]?.leitungsperson.vorname}{' '}
                  {module.modulanlass.anlassleitungen[0]?.leitungsperson.nachname}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

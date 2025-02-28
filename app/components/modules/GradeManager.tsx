'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Registration, ManualGrade, NewManualGrade, ModuleType, buttonVariants } from '../../types/modules';
import { groupModules, getAvailableModules } from '../../utils/moduleUtils';

interface GradeManagerProps {
  registrations: Registration[] | null;
  onUpdateRegistration: (updatedModule: Registration) => void;
  onAddManualGrade: (grade: ManualGrade) => void;
}

export default function GradeManager({ 
  registrations, 
  onUpdateRegistration, 
  onAddManualGrade 
}: GradeManagerProps) {
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Registration | null>(null);
  const [editingModuleTemp, setEditingModuleTemp] = useState<{
    grade: number;
    weight: number; // Weight in percentage for internal module calculation
    ects: number;
    type: 'MAIN' | 'MSP' | 'EN';
  } | null>(null);
  const [newManualGrade, setNewManualGrade] = useState<NewManualGrade>({
    moduleName: '',
    grade: 4.0,
    weight: 100, // Default to 100% if it's the only grade
    ects: 3,
    type: 'MAIN',
    isExistingModule: false
  });

  // Calculate final grade for a module
  const calculateModuleFinalGrade = (grades: Registration[]) => {
    if (!grades.length) return null;
    
    // If there's a MAIN type grade with a final grade, use that as it's the official university grade
    const mainGrade = grades.find(g => g.moduleType?.type === 'MAIN' && g.freieNote !== null);
    if (mainGrade && mainGrade.freieNote !== null) return mainGrade.freieNote;

    // Get all grades that have a value
    const validGrades = grades.filter(g => g.freieNote !== null);
    if (validGrades.length === 0) return null;

    // Calculate total weight and weighted sum
    const totalWeight = validGrades.reduce((sum, g) => sum + (g.moduleType?.weight || 0), 0);
    
    if (totalWeight === 0) return null;

    const weightedSum = validGrades.reduce((sum, g) => {
      const weight = g.moduleType?.weight || 0;
      return sum + (g.freieNote! * weight);
    }, 0);

    const finalGrade = weightedSum / totalWeight;
    
    // Round up grades ≥ 5.25 to 5.5 for final module grades
    return finalGrade >= 5.25 ? 5.5 : finalGrade;
  };

  // Calculate overall weighted average based on ECTS
  const calculateOverallAverage = (modules: { name: string; modules: Registration[]; ects: number }[]) => {
    let totalEcts = 0;
    let weightedSum = 0;

    modules.forEach(module => {
      const finalGrade = calculateModuleFinalGrade(module.modules);
      if (finalGrade !== null) {
        totalEcts += module.ects;
        weightedSum += finalGrade * module.ects;
      }
    });

    if (totalEcts === 0) return null;
    const average = weightedSum / totalEcts;
    
    // Round up grades ≥ 5.25 to 5.5 for the overall average
    return average >= 5.25 ? 5.5 : average;
  };

  // Get available modules for dropdown
  const getAvailableModules = () => {
    if (!registrations) return [];
    return groupModules(registrations)
      .map(group => group.name)
      .sort();
  };

  const handleAddManualGrade = () => {
    if (newManualGrade.moduleName && !isNaN(newManualGrade.grade)) {
      onAddManualGrade({
        moduleName: newManualGrade.moduleName,
        grade: Number(newManualGrade.grade),
        weight: newManualGrade.weight,
        ects: newManualGrade.ects,
        type: newManualGrade.type
      });

      // Reset form and close modal
      setNewManualGrade({
        moduleName: '',
        grade: 4.0,
        weight: 100,
        ects: 3,
        type: 'MAIN',
        isExistingModule: false
      });
      setShowAddGradeModal(false);
    }
  };

  const handleSaveModuleEdit = () => {
    if (editingModule && editingModuleTemp) {
      const updatedModule = {
        ...editingModule,
        freieNote: editingModuleTemp.grade,
        moduleType: {
          type: editingModuleTemp.type,
          weight: editingModuleTemp.weight,
          ects: editingModuleTemp.ects
        }
      };
      onUpdateRegistration(updatedModule);
      setEditingModule(null);
    }
  };

  if (!registrations) return null;

  const grouped = groupModules(registrations);
  const overallAverage = calculateOverallAverage(grouped);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Grade Manager</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and customize your module grades, weights, and ECTS credits
        </p>
        <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Important:</strong> For modules without an official university-calculated final grade, 
            please adjust the weights of EN and MSP grades according to your professor's requirements. 
            Default weights are set to 50% but may vary by module.
          </p>
        </div>
        {overallAverage !== null && (
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
            Overall Average: {overallAverage.toFixed(2)}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {grouped.map((group, index) => {
          const finalGrade = calculateModuleFinalGrade(group.modules);
          const hasMainGrade = group.modules.some(m => m.moduleType?.type === 'MAIN' && m.freieNote !== null);
          
          return (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{group.name}</h4>
                    {hasMainGrade && (
                      <div className="tooltip" title="Official university-calculated final grade">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ECTS: {group.ects} | Final Grade: {
                      finalGrade !== null ? finalGrade.toFixed(2) : 'No grade yet'
                    }
                  </p>
                  {!hasMainGrade && group.modules.length > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      No official grade yet - weights can be adjusted
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setNewManualGrade({
                      moduleName: group.name,
                      grade: 4.0,
                      weight: 50,
                      ects: group.ects,
                      type: 'EN',
                      isExistingModule: true
                    });
                    setShowAddGradeModal(true);
                  }}
                  className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Grade to Module</span>
                </motion.button>
              </div>

              <div className="space-y-2">
                {group.modules.map((module) => (
                  <motion.div
                    key={module.modulanlassAnmeldungId}
                    className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {module.modulanlass.bezeichnung}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          module.moduleType?.type === 'MSP' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                          module.moduleType?.type === 'EN' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}>
                          {module.moduleType?.type === 'MAIN' ? 'Official Final' : module.moduleType?.type || 'Official Final'}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 space-x-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Weight: {module.moduleType?.weight || 0}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ECTS: {module.moduleType?.ects}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {module.freieNote !== null ? (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          module.freieNote >= 4
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        }`}>
                          {module.freieNote.toFixed(1)}
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          No grade
                        </div>
                      )}
                      {/* Only show edit/delete for non-official grades */}
                      {(!hasMainGrade || module.moduleType?.type !== 'MAIN') && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingModule(module);
                              setEditingModuleTemp({
                                grade: module.freieNote || 4.0,
                                weight: module.moduleType?.weight || 50,
                                ects: module.moduleType?.ects || 0,
                                type: module.moduleType?.type || 'EN'
                              });
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Edit grade"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this grade?')) {
                                const updatedModule = {
                                  ...module,
                                  freieNote: null
                                };
                                onUpdateRegistration(updatedModule);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Delete grade"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Grade Modal */}
      {showAddGradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Manual Grade</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setNewManualGrade(prev => ({ ...prev, isExistingModule: false }))}
                  className={`px-3 py-2 rounded-lg ${
                    !newManualGrade.isExistingModule
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  New Module
                </button>
                <button
                  onClick={() => setNewManualGrade(prev => ({ ...prev, isExistingModule: true }))}
                  className={`px-3 py-2 rounded-lg ${
                    newManualGrade.isExistingModule
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Existing Module
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Module Name
                </label>
                {newManualGrade.isExistingModule ? (
                  <select
                    value={newManualGrade.moduleName}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const moduleGroup = registrations ? groupModules(registrations).find(g => g.name === selectedName) : null;
                      const mainModule = moduleGroup?.modules.find(m => m.moduleType?.type === 'MAIN');
                      
                      if (moduleGroup && mainModule) {
                        setNewManualGrade(prev => ({
                          ...prev,
                          moduleName: selectedName,
                          weight: mainModule.moduleType?.weight || 100,
                          ects: moduleGroup.ects,
                          type: mainModule.moduleType?.type || 'MAIN'
                        }));
                      }
                    }}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Select a module...</option>
                    {getAvailableModules().map(moduleName => (
                      <option key={moduleName} value={moduleName}>
                        {moduleName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newManualGrade.moduleName}
                    onChange={(e) => setNewManualGrade(prev => ({ ...prev, moduleName: e.target.value }))}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter module name..."
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  step="0.1"
                  value={newManualGrade.grade}
                  onChange={(e) => setNewManualGrade(prev => ({ ...prev, grade: parseFloat(e.target.value) || 4.0 }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newManualGrade.weight}
                  onChange={(e) => setNewManualGrade(prev => ({ ...prev, weight: parseInt(e.target.value) || 100 }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ECTS
                </label>
                <input
                  type="number"
                  min="0"
                  value={newManualGrade.ects}
                  onChange={(e) => setNewManualGrade(prev => ({ ...prev, ects: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newManualGrade.type}
                  onChange={(e) => setNewManualGrade(prev => ({ ...prev, type: e.target.value as 'MAIN' | 'MSP' | 'EN' }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="MAIN">Official University Final</option>
                  <option value="MSP">MSP</option>
                  <option value="EN">EN</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddGradeModal(false);
                  setNewManualGrade({
                    moduleName: '',
                    grade: 4.0,
                    weight: 100,
                    ects: 3,
                    type: 'MAIN',
                    isExistingModule: false
                  });
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddManualGrade}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Grade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Module Modal */}
      {editingModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Module</h3>
              <button
                onClick={() => setEditingModule(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Module Name
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {editingModule.modulanlass.bezeichnung}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Grade
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  step="0.1"
                  value={editingModuleTemp?.grade || 0}
                  onChange={(e) => setEditingModuleTemp(prev => prev ? { ...prev, grade: parseFloat(e.target.value) || 4.0 } : null)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingModuleTemp?.weight || 100}
                  onChange={(e) => setEditingModuleTemp(prev => prev ? { ...prev, weight: parseInt(e.target.value) || 100 } : null)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ECTS
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingModuleTemp?.ects || 0}
                  onChange={(e) => setEditingModuleTemp(prev => prev ? { ...prev, ects: parseInt(e.target.value) || 0 } : null)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={editingModuleTemp?.type || 'MAIN'}
                  onChange={(e) => setEditingModuleTemp(prev => prev ? { ...prev, type: e.target.value as 'MAIN' | 'MSP' | 'EN' } : null)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="MAIN">Official University Final</option>
                  <option value="MSP">MSP</option>
                  <option value="EN">EN</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingModule(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModuleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
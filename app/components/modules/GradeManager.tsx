'use client';
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Registration, ManualGrade, NewManualGrade, buttonVariants } from '../../types/modules';
import { groupModules } from '../../utils/moduleUtils';
import ModuleEditModal from './ModuleEditModal';
import { useTranslations } from 'next-intl';

interface GradeManagerProps {
  registrations: Registration[] | null;
  onUpdateRegistration: (module: Registration) => void;
  onAddManualGrade: (grade: ManualGrade) => void;
  onDeleteModule?: (moduleId: number) => void;
}

export default function GradeManager({ 
  registrations, 
  onUpdateRegistration, 
  onAddManualGrade,
  onDeleteModule 
}: GradeManagerProps) {
  // Move hooks to the top level
  const t = useTranslations('grades');
  const commonT = useTranslations('common');

  // Define fallback functions
  const getFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'grade_manager': 'Grade Manager',
      'grade_manager_description': 'Manage and customize your module grades, weights, and ECTS credits',
      'overall_ects_average': 'Overall ECTS Weighted Average',
      'grade_weight_info': 'Grade Weight Information',
      'weight_info_official': 'Official university-calculated final grades always have a weight of 100%',
      'weight_info_default': 'For modules without an official grade, default weights are:',
      'weight_info_en': 'EN (Individual Grade): 50%',
      'weight_info_msp': 'MSP (Oral Exam): 50%',
      'weight_info_adjust': 'Please adjust these weights according to your professor\'s specific requirements',
      'final_grade': 'Final Grade',
      'module_name': 'Module Name',
      'add_manual_grade': 'Add Manual Grade',
      'new_module': 'New Module',
      'existing_module': 'Existing Module',
      'select_module': 'Select a module...',
      'enter_module_name': 'Enter module name...',
      'grade': 'Grade',
      'weight': 'Weight',
      'ects': 'ECTS',
      'type': 'Type',
      'official_university_final': 'Official Final Grade',
      'calculated_final': 'Calculated Final Grade',
      'official_grade': 'Official',
      'add_grade': 'Add Grade',
      'edit': 'Edit',
      'delete': 'Delete'
    };
    return fallbacks[key] || key;
  }, []);

  const getCommonFallbackTranslation = useCallback((key: string): string => {
    const fallbacks: Record<string, string> = {
      'cancel': 'Cancel',
      'official_final': 'Official Final',
      'weight': 'Weight',
      'add_grade': 'Add Grade',
      'edit': 'Edit',
      'delete': 'Delete'
    };
    return fallbacks[key] || key;
  }, []);

  // Wrap translation calls in try-catch
  const getTranslation = useCallback((key: string): string => {
    try {
      return t(key);
    } catch {
      return getFallbackTranslation(key);
    }
  }, [t, getFallbackTranslation]);

  const getCommonTranslation = useCallback((key: string): string => {
    try {
      return commonT(key);
    } catch {
      return getCommonFallbackTranslation(key);
    }
  }, [commonT, getCommonFallbackTranslation]);

  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [newManualGrade, setNewManualGrade] = useState<NewManualGrade>({
    moduleName: '',
    grade: 4.0,
    weight: 100,
    ects: 3,
    type: 'MAIN',
    isExistingModule: false
  });
  const [selectedModule, setSelectedModule] = useState<Registration | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Registration | null>(null);

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
      if (editingModule) {
        // Update existing grade
        const updatedModule = {
          ...editingModule,
          freieNote: Number(newManualGrade.grade),
          moduleType: {
            ...editingModule.moduleType,
            weight: newManualGrade.weight,
            ects: newManualGrade.ects,
            type: newManualGrade.type
          },
          bestanden: Number(newManualGrade.grade) >= 4
        };
        onUpdateRegistration(updatedModule);
      } else {
        // Add new grade
        onAddManualGrade({
          moduleName: newManualGrade.moduleName,
          grade: Number(newManualGrade.grade),
          weight: newManualGrade.weight,
          ects: newManualGrade.ects,
          type: newManualGrade.type
        });
      }

      // Reset form and close modal
      setNewManualGrade({
        moduleName: '',
        grade: 4.0,
        weight: 100,
        ects: 3,
        type: 'MAIN',
        isExistingModule: false
      });
      setEditingModule(null);
      setShowAddGradeModal(false);
    }
  };

  const onEditGrade = (module: Registration) => {
    setEditingModule(module);
    setNewManualGrade({
      moduleName: module.modulanlass.bezeichnung,
      grade: module.freieNote || 4.0,
      weight: module.moduleType?.weight || 50,
      ects: module.moduleType?.ects || 0,
      type: module.moduleType?.type || 'EN',
      isExistingModule: true
    });
    setShowAddGradeModal(true);
  };

  const onDeleteGrade = (module: Registration) => {
    if (window.confirm(getTranslation('confirm_delete'))) {
      // If this module was manually added, delete it entirely
      if (module.statusName === getTranslation('manual_entry') && onDeleteModule) {
        onDeleteModule(module.modulanlassAnmeldungId);
      } else {
        // For imported modules, just clear the grade
        const updatedModule = {
          ...module,
          freieNote: null
        };
        onUpdateRegistration(updatedModule);
      }
    }
  };

  const handleAddGrade = (module: Registration) => {
    setNewManualGrade({
      moduleName: module.modulanlass.bezeichnung,
      grade: 4.0,
      weight: 50,
      ects: module.moduleType?.ects || 0,
      type: 'EN',
      isExistingModule: true
    });
    setShowAddGradeModal(true);
  };

  const handleEditModule = (module: Registration) => {
    setSelectedModule(module);
    setIsEditModalOpen(true);
  };

  const handleSaveModule = (updatedModule: Registration) => {
    onUpdateRegistration(updatedModule);
    setIsEditModalOpen(false);
    setSelectedModule(null);
  };

  if (!registrations) return null;

  const grouped = groupModules(registrations);
  // Filter out groups where all modules have null grades (unless they're all manual entries)
  const filteredGroups = grouped.filter(group => 
    group.modules.some(m => m.freieNote !== null) || 
    group.modules.every(m => m.statusName === getTranslation('manual_entry'))
  );
  const overallAverage = calculateOverallAverage(filteredGroups);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {getTranslation('grade_manager')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getTranslation('grade_manager_description')}
            </p>
          </div>
          {overallAverage !== null && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-xl rounded-2xl px-5 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {getTranslation('overall_ects_average')}
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className={`text-3xl font-black ${overallAverage >= 5.0 ? 'text-green-600 dark:text-green-400' : overallAverage >= 4.0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {overallAverage.toFixed(1)}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">/ 6.0</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Compact Info Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 backdrop-blur rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-400/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">{getTranslation('grade_weight_info')}:</span> {getTranslation('weight_info_official')} • 
              EN: 50%, MSP: 50% • <span className="italic">{getTranslation('weight_info_adjust')}</span>
            </div>
          </div>
        </motion.div>

        {/* Module Cards Grid */}
        {filteredGroups.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{getTranslation('no_modules_yet')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">{getTranslation('start_adding_module')}</p>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setNewManualGrade({
                  moduleName: '',
                  grade: 4.0,
                  weight: 100,
                  ects: 3,
                  type: 'MAIN',
                  isExistingModule: false
                });
                setShowAddGradeModal(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {getTranslation('add_manual_grade')}
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {filteredGroups.map((group, index) => {
            const finalGrade = calculateModuleFinalGrade(group.modules);
            const hasMainGrade = group.modules.some(m => m.moduleType?.type === 'MAIN' && m.freieNote !== null);
            
            return (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {/* Compact Header with Grade */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={group.name}>
                        {group.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {group.ects} ECTS
                        </span>
                        {hasMainGrade && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Official
                          </span>
                        )}
                      </div>
                    </div>
                    {finalGrade !== null && (
                      <div className="flex-shrink-0">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-xl font-bold text-lg ${
                          finalGrade >= 5.5 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300' :
                          finalGrade >= 4 ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300' : 
                          'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 dark:text-red-300'
                        }`}>
                          {finalGrade.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Top Right Corner */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditModule(group.modules[0])}
                      className="p-1.5 bg-white/80 dark:bg-gray-700/80 backdrop-blur rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 shadow-sm"
                      title={getTranslation('edit_module')}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.button>
                    {!hasMainGrade && group.modules.every(m => m.statusName === getTranslation('manual_entry')) && onDeleteModule && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (window.confirm(`Delete the entire module "${group.name}"?`)) {
                            group.modules.forEach(m => onDeleteModule(m.modulanlassAnmeldungId));
                          }
                        }}
                        className="p-1.5 bg-white/80 dark:bg-gray-700/80 backdrop-blur rounded-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 shadow-sm"
                        title="Delete module"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Compact Grades */}
                  <div className="space-y-2">
                    {group.modules.map((module) => (
                      <div 
                        key={module.modulanlassAnmeldungId}
                        className="flex items-center justify-between gap-2 p-2 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                            module.moduleType?.type === 'MSP' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' :
                            module.moduleType?.type === 'EN' ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' :
                            'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                          }`}>
                            {module.moduleType?.type === 'MSP' ? 'MSP' : module.moduleType?.type === 'EN' ? 'EN' : 'Final'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {module.moduleType?.weight}%
                          </span>
                        </div>

                        {module.freieNote === null ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddGrade(module)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                          >
                            + Add
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className={`px-2.5 py-1 rounded-lg font-bold text-sm ${
                              module.bestanden 
                                ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                                : 'bg-red-500/20 text-red-700 dark:text-red-300'
                            }`}>
                              {module.freieNote.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onEditGrade(module)}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onDeleteGrade(module)}
                                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>

      {/* Floating Action Button - More subtle */}
      {filteredGroups.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setNewManualGrade({
              moduleName: '',
              grade: 4.0,
              weight: 100,
              ects: 3,
              type: 'MAIN',
              isExistingModule: false
            });
            setShowAddGradeModal(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group backdrop-blur-xl"
          title={getTranslation('add_manual_grade')}
        >
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      )}

      {/* Add Grade Modal - Improved */}
      {showAddGradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingModule ? getTranslation('edit_grade') : getTranslation('add_manual_grade')}
            </h3>
            <div className="space-y-4">
              {!editingModule && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setNewManualGrade(prev => ({ ...prev, isExistingModule: false }))}
                    className={`px-3 py-2 rounded-lg ${
                      !newManualGrade.isExistingModule
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {getTranslation('new_module')}
                  </button>
                  <button
                    onClick={() => setNewManualGrade(prev => ({ ...prev, isExistingModule: true }))}
                    className={`px-3 py-2 rounded-lg ${
                      newManualGrade.isExistingModule
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {getTranslation('existing_module')}
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {getTranslation('module_name')}
                </label>
                {editingModule ? (
                  <input
                    type="text"
                    value={newManualGrade.moduleName}
                    disabled
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                  />
                ) : newManualGrade.isExistingModule ? (
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
                    <option value="">{getTranslation('select_module')}</option>
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
                    placeholder={getTranslation('enter_module_name')}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {getTranslation('grade')}
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
                  {getTranslation('weight')} (%)
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
                  {getTranslation('ects')}
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
                  {getTranslation('type')}
                </label>
                <select
                  value={newManualGrade.type}
                  onChange={(e) => setNewManualGrade(prev => ({ ...prev, type: e.target.value as 'MAIN' | 'MSP' | 'EN' }))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="MAIN">{getTranslation('official_university_final')}</option>
                  <option value="MSP">MSP</option>
                  <option value="EN">EN</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddGradeModal(false);
                  setEditingModule(null);
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
                {getCommonTranslation('cancel')}
              </button>
              <button
                onClick={handleAddManualGrade}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {editingModule ? getCommonTranslation('save') : getTranslation('add_grade')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Module Modal */}
      {isEditModalOpen && selectedModule && (
        <ModuleEditModal
          isOpen={isEditModalOpen}
          module={selectedModule}
          onSave={handleSaveModule}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedModule(null);
          }}
        />
      )}
    </div>
  );
} 
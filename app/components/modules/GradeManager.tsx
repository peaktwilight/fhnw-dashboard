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
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{getTranslation('grade_manager')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getTranslation('grade_manager_description')}
            </p>
          </div>
          {overallAverage !== null && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg px-6 py-4 border border-blue-100 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">{getTranslation('overall_ects_average')}</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {overallAverage.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Important Notice Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-3">{getTranslation('grade_weight_info')}</h4>
              <ul className="text-sm space-y-2 text-blue-700 dark:text-blue-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"></span>
                  <span>{getTranslation('weight_info_official')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"></span>
                  <span>{getTranslation('weight_info_default')}</span>
                </li>
                <ul className="ml-8 space-y-1 text-blue-600 dark:text-blue-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-300 dark:bg-blue-600 rounded-full"></span>
                    <span>{getTranslation('weight_info_en')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-300 dark:bg-blue-600 rounded-full"></span>
                    <span>{getTranslation('weight_info_msp')}</span>
                  </li>
                </ul>
                <li className="flex items-center gap-2 italic">
                  <span className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"></span>
                  <span>{getTranslation('weight_info_adjust')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredGroups.map((group) => {
            const finalGrade = calculateModuleFinalGrade(group.modules);
            const hasMainGrade = group.modules.some(m => m.moduleType?.type === 'MAIN' && m.freieNote !== null);
            
            return (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Final Grade Display - Prominent at Top */}
                  {finalGrade !== null && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {hasMainGrade && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-medium text-green-700 dark:text-green-300">{getTranslation('official_university_final')}</span>
                            </div>
                          )}
                          {!hasMainGrade && (
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{getTranslation('calculated_final')}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{getTranslation('final_grade')}:</span>
                          <span className={`text-3xl font-bold ${
                            finalGrade >= 4 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {finalGrade.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Module Header */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>{getTranslation('ects')}: {group.ects}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleEditModule(group.modules[0])}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title={getTranslation('edit_module')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </motion.button>
                        {/* Show delete button only for manually added modules */}
                        {!hasMainGrade && group.modules.every(m => m.statusName === getTranslation('manual_entry')) && onDeleteModule && (
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => {
                              if (window.confirm(`Delete the entire module "${group.name}"?`)) {
                                group.modules.forEach(m => onDeleteModule(m.modulanlassAnmeldungId));
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                            title="Delete module"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grades List */}
                  <div className="space-y-3">
                    {group.modules.map((module) => (
                      <motion.div 
                        key={module.modulanlassAnmeldungId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                                module.moduleType?.type === 'MSP' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                module.moduleType?.type === 'EN' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' :
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              }`}>
                                {module.moduleType?.type === 'MSP' ? 'MSP' : module.moduleType?.type === 'EN' ? 'EN' : 'Final'}
                              </span>
                              {module.moduleType?.type === 'MAIN' && (
                                <div className="flex items-center" title={getTranslation('official_university_final')}>
                                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {module.moduleType?.weight && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {getCommonTranslation('weight')}: {module.moduleType.weight}%
                              </span>
                            )}
                          </div>
                          {module.freieNote !== null && (
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold ${
                              module.bestanden 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}>
                              <span className="text-lg">{module.freieNote.toFixed(1)}</span>
                              {module.bestanden ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-2">
                            {module.freieNote === null ? (
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => handleAddGrade(module)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {getCommonTranslation('add_grade')}
                              </motion.button>
                            ) : (
                              <>
                                <motion.button
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={() => onEditGrade(module)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  {getCommonTranslation('edit')}
                                </motion.button>
                                <motion.button
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={() => onDeleteGrade(module)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  {getCommonTranslation('delete')}
                                </motion.button>
                              </>
                            )}
                          </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {filteredGroups.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
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
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group"
          title={getTranslation('add_manual_grade')}
        >
          <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      )}

      {/* Add Grade Modal */}
      {showAddGradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
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
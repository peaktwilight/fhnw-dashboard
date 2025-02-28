'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Registration, ModuleStats } from '../../types/modules';
import { getGradeDistribution, getModuleProgress } from '../../utils/moduleUtils';

interface ModuleOverviewProps {
  stats: ModuleStats | null;
  registrations: Registration[] | null;
}

export default function ModuleOverview({ stats, registrations }: ModuleOverviewProps) {
  if (!stats || !registrations) return null;
  
  // Get all grades for distribution
  const completed = registrations.filter(r => r.freieNote !== null);
  const grades = completed.map(r => r.freieNote).filter((g): g is number => g !== null);
  const gradeDistribution = getGradeDistribution(grades);
  const moduleProgress = getModuleProgress(registrations);

  return (
    <div className="p-6 space-y-6 border-b border-gray-200 dark:border-gray-700">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Modules', value: stats.totalModules },
          { label: 'Completed', value: stats.completedModules },
          {
            label: 'Raw Average',
            value: stats.averageGrade || '-',
            description: 'Simple average of all grades'
          },
          {
            label: 'Weighted Average',
            value: stats.weightedAverage || '-',
            description: 'Average weighted by ECTS and module type'
          },
          {
            label: 'Pass Rate',
            value: stats.completedModules > 0
              ? `${Math.round((stats.passedModules / stats.completedModules) * 100)}%`
              : '-',
            description: 'Percentage of modules with grade ≥ 4.0'
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
            <div className="space-y-1">
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
              {stat.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-xs text-gray-400 dark:text-gray-500 mt-1"
                >
                  {stat.description}
                </motion.p>
              )}
            </div>
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
                    {stats.currentModules} Active
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
                    {stats.completedModules - stats.passedModules} Failed
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
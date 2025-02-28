import { Registration, ModuleType, ModuleGroup, GradeDistribution, ModuleProgress, ModuleStats } from '../types/modules';

/**
 * Detects the type of a module based on its name and number
 */
export const detectModuleType = (module: Registration): ModuleType => {
  const bezeichnung = module.modulanlass.bezeichnung;
  const isMain = !bezeichnung.includes('(MSP)') &&
                 !bezeichnung.includes('(EN)') &&
                 !bezeichnung.includes('.SE/') &&
                 !bezeichnung.includes('.SP/');
  
  // Main modules are those without MSP/EN suffix and with HN in the number
  if (isMain && module.modulanlass.nummer.includes('.HN')) {
    return { type: 'MAIN', weight: 100, ects: 3 }; // Main grade gets 100% weight as it's the official university grade
  }
  
  // MSP modules are those with MSP suffix or SP in the number
  if (bezeichnung.includes('(MSP)') || module.modulanlass.nummer.includes('.SP/')) {
    return { type: 'MSP', weight: 50, ects: 0 }; // Default 50% - should be adjusted based on professor's requirements
  }
  
  // EN modules are those with EN suffix or SE in the number
  if (bezeichnung.includes('(EN)') || module.modulanlass.nummer.includes('.SE/')) {
    return { type: 'EN', weight: 50, ects: 0 }; // Default 50% - should be adjusted based on professor's requirements
  }
  
  // Default to MAIN if none of the above
  return { type: 'MAIN', weight: 100, ects: 3 };
};

/**
 * Gets the base name of a module by removing semester info and section numbers
 */
export const getModuleBaseName = (bezeichnung: string): string => {
  // Remove semester info and section numbers
  return bezeichnung
    .replace(/ 24HS.*$/, '')  // Remove semester and section
    .replace(/ \(MSP\)/, '')  // Remove MSP indicator
    .replace(/ \(EN\)/, '')   // Remove EN indicator
    .replace(/ \(SG I\)/, '') // Remove SG I indicator
    .replace(/ \(Elective\)/, '') // Remove Elective indicator
    .trim();
};

/**
 * Groups modules by their base name and calculates weighted grades
 */
export const groupModules = (modules: Registration[]): ModuleGroup[] => {
  const groups = new Map<string, Registration[]>();
  
  modules.forEach(module => {
    const baseName = getModuleBaseName(module.modulanlass.bezeichnung);
    const moduleType = detectModuleType(module);
    module.moduleType = moduleType;
    module.groupName = baseName;
    
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    groups.get(baseName)?.push(module);
  });

  // Second pass: Create module groups with weighted calculations
  return Array.from(groups.entries()).map(([name, groupModules]) => {
    // Sort modules so MAIN comes first, then EN, then MSP
    const sortedModules = groupModules.sort((a, b) => {
      const typeOrder = { MAIN: 0, EN: 1, MSP: 2 };
      return typeOrder[a.moduleType?.type || 'MAIN'] - typeOrder[b.moduleType?.type || 'MAIN'];
    });

    // Find the main module for ECTS
    const mainModule = sortedModules.find(m =>
      m.moduleType?.type === 'MAIN' && m.modulanlass.nummer.includes('.HN')
    );
    const ects = mainModule?.moduleType?.ects || 0;
    
    // If main module has a grade, use that directly
    const mainModuleGrade = mainModule?.freieNote;
    let weightedGrade: number | undefined;

    if (mainModuleGrade !== null && mainModuleGrade !== undefined) {
      // Use the official grade from the main module
      weightedGrade = mainModuleGrade;
    } else {
      // Calculate weighted grade from EN and MSP modules
      const validGrades = sortedModules
        .filter(m => m.freieNote !== null && m.moduleType?.type !== 'MAIN');
      
      if (validGrades.length > 0) {
        const weightedSum = validGrades.reduce((sum, module) => {
          return sum + (module.freieNote || 0) * (module.moduleType?.weight || 0);
        }, 0);
        
        const totalWeight = validGrades.reduce((sum, module) => {
          return sum + (module.moduleType?.weight || 0);
        }, 0);

        weightedGrade = totalWeight > 0 ? (weightedSum / totalWeight) : undefined;
      }
    }

    return {
      name,
      modules: sortedModules,
      ects,
      weightedGrade,
      isOfficialGrade: mainModuleGrade !== null && mainModuleGrade !== undefined
    };
  }).sort((a, b) => a.name.localeCompare(b.name)); // Sort groups alphabetically
};

/**
 * Calculates grade distribution for visualization
 */
export const getGradeDistribution = (grades: number[]): GradeDistribution[] => {
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

/**
 * Calculates module progress statistics
 */
export const getModuleProgress = (registrations: Registration[] | null): ModuleProgress => {
  if (!registrations) return { completed: 0, inProgress: 0, total: 0, percentage: 0 };
  
  const total = registrations.length;
  const completed = registrations.filter(r => r.freieNote !== null).length;
  const inProgress = total - completed;
  const percentage = (completed / total) * 100;

  return { completed, inProgress, total, percentage };
};

/**
 * Calculates comprehensive statistics about modules
 */
export const calculateStats = (registrations: Registration[] | null): ModuleStats | null => {
  if (!registrations) return null;
  
  const completed = registrations.filter(r => r.freieNote !== null) || [];
  
  return {
    totalModules: registrations.length,
    completedModules: completed.length,
    currentModules: registrations.length - completed.length,
    averageGrade: completed.length > 0
      ? (completed.reduce((sum, reg) => sum + (reg.freieNote || 0), 0) / completed.length).toFixed(2)
      : null,
    weightedAverage: completed.length > 0
      ? (groupModules(completed).reduce((sum, group) => {
          const weightedGrade = group.weightedGrade || 0;
          const weight = group.ects || 0;
          return sum + (weightedGrade * weight);
        }, 0) / groupModules(completed).reduce((sum, group) => sum + (group.ects || 0), 0)).toFixed(2)
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
  };
};

/**
 * Filters modules based on search term
 */
export const filterModules = (modules: Registration[], searchTerm: string): Registration[] => {
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

/**
 * Gets unique module names from registrations for dropdown selection
 */
export const getAvailableModules = (registrations: Registration[] | null): string[] => {
  if (!registrations) return [];
  // Use the existing groupModules function to get grouped names
  return groupModules(registrations)
    .map(group => group.name)
    .sort();
}; 
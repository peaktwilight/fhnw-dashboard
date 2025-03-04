import { Registration, ModuleType, ModuleGroup, GradeDistribution, ModuleProgress, ModuleStats } from '../types/modules';

/**
 * Detects the type of a module based on its name and number
 */
export const detectModuleType = (module: Registration): ModuleType => {
  const bezeichnung = module.modulanlass.bezeichnung;
  const nummer = module.modulanlass.nummer;
  
  // Check if this is an official final grade (HN in number)
  if (nummer.includes('.HN')) {
    return { type: 'MAIN', weight: 100, ects: module.moduleType?.ects || 3 }; // Use existing ECTS if available
  }
  
  // MSP modules are those with MSP suffix or SP in the number
  if (bezeichnung.includes('(MSP)') || nummer.includes('.SP/')) {
    return { type: 'MSP', weight: 50, ects: 0 }; // MSP doesn't contribute to ECTS
  }
  
  // EN modules are those with EN suffix or SE in the number
  if (bezeichnung.includes('(EN)') || nummer.includes('.SE/')) {
    return { type: 'EN', weight: 50, ects: 0 }; // EN doesn't contribute to ECTS
  }
  
  // If no specific type is detected, treat as a regular module
  return { type: 'MAIN', weight: 100, ects: module.moduleType?.ects || 3 };
};

/**
 * Gets the base name of a module by removing semester info and section numbers
 */
export const getModuleBaseName = (bezeichnung: string): string => {
  // Remove semester info and section numbers
  return bezeichnung
    .replace(/ (24HS|25FS).*$/, '')  // Remove semester and section
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
    
    // Preserve existing ECTS value if it exists
    if (module.moduleType?.ects) {
      moduleType.ects = module.moduleType.ects;
    }
    
    module.moduleType = moduleType;
    module.groupName = baseName;
    
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    groups.get(baseName)?.push(module);
  });

  return Array.from(groups.entries()).map(([name, groupModules]) => {
    // Sort modules: MAIN (HN) first, then other MAIN, then EN, then MSP
    const sortedModules = groupModules.sort((a, b) => {
      const typeOrder = { 'MAIN-HN': 0, MAIN: 1, EN: 2, MSP: 3 };
      const aType = a.modulanlass.nummer.includes('.HN') ? 'MAIN-HN' : a.moduleType?.type || 'MAIN';
      const bType = b.modulanlass.nummer.includes('.HN') ? 'MAIN-HN' : b.moduleType?.type || 'MAIN';
      return typeOrder[aType] - typeOrder[bType];
    });

    // Find the official final grade module (HN)
    const mainModule = sortedModules.find(m => m.modulanlass.nummer.includes('.HN'));
    const ects = mainModule?.moduleType?.ects || 3;
    
    // Calculate final grade
    const mainModuleGrade = mainModule?.freieNote;
    let weightedGrade: number | undefined;

    if (mainModuleGrade !== null && mainModuleGrade !== undefined) {
      weightedGrade = mainModuleGrade;
    } else {
      const validGrades = sortedModules.filter(m => 
        m.freieNote !== null && 
        !m.modulanlass.nummer.includes('.HN')
      );
      
      if (validGrades.length > 0) {
        const weightedSum = validGrades.reduce((sum, module) => 
          sum + (module.freieNote || 0) * (module.moduleType?.weight || 0), 0);
        
        const totalWeight = validGrades.reduce((sum, module) => 
          sum + (module.moduleType?.weight || 0), 0);

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
  }).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Calculates grade distribution for visualization
 */
export const getGradeDistribution = (grades: number[]): GradeDistribution[] => {
  const ranges = [
    { min: 5.5, max: 6.0, label: '5.5-6.0', color: 'bg-green-500', key: 'grade_range_5_5_6_0' },
    { min: 5.0, max: 5.4, label: '5.0-5.4', color: 'bg-green-400', key: 'grade_range_5_0_5_4' },
    { min: 4.5, max: 4.9, label: '4.5-4.9', color: 'bg-green-300', key: 'grade_range_4_5_4_9' },
    { min: 4.0, max: 4.4, label: '4.0-4.4', color: 'bg-green-200', key: 'grade_range_4_0_4_4' },
    { min: 3.5, max: 3.9, label: '3.5-3.9', color: 'bg-red-300', key: 'grade_range_3_5_3_9' },
    { min: 1.0, max: 3.4, label: '1.0-3.4', color: 'bg-red-500', key: 'grade_range_1_0_3_4' },
  ];

  return ranges.map(range => ({
    range: range.label,
    count: grades.filter(g => g >= range.min && g <= range.max).length,
    color: range.color,
    key: range.key
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
  const grouped = groupModules(completed);
  
  // Calculate weighted average based on ECTS
  const weightedAverage = (() => {
    let totalEcts = 0;
    let weightedSum = 0;

    grouped.forEach(group => {
      // Use the official final grade if available, otherwise calculate from EN/MSP
      const mainModule = group.modules.find(m => m.modulanlass.nummer.includes('.HN'));
      const ects = mainModule?.moduleType?.ects || 3;
      
      if (mainModule?.freieNote !== null && mainModule?.freieNote !== undefined) {
        // Use official final grade
        totalEcts += ects;
        weightedSum += mainModule.freieNote * ects;
      } else {
        // Calculate from EN/MSP grades
        const validGrades = group.modules.filter(m => 
          m.freieNote !== null && 
          !m.modulanlass.nummer.includes('.HN')
        );
        
        if (validGrades.length > 0) {
          const gradeSum = validGrades.reduce((sum, module) => 
            sum + (module.freieNote || 0) * (module.moduleType?.weight || 0), 0);
          
          const totalWeight = validGrades.reduce((sum, module) => 
            sum + (module.moduleType?.weight || 0), 0);

          if (totalWeight > 0) {
            const finalGrade = gradeSum / totalWeight;
            totalEcts += ects;
            weightedSum += finalGrade * ects;
          }
        }
      }
    });

    if (totalEcts === 0) return null;
    const average = weightedSum / totalEcts;
    // Round up grades ≥ 5.25 to 5.5 for the overall average
    return average >= 5.25 ? 5.5 : average;
  })();
  
  return {
    totalModules: registrations.length,
    completedModules: completed.length,
    currentModules: registrations.length - completed.length,
    averageGrade: completed.length > 0
      ? (completed.reduce((sum, reg) => sum + (reg.freieNote || 0), 0) / completed.length).toFixed(2)
      : null,
    weightedAverage: weightedAverage !== null ? weightedAverage.toFixed(2) : null,
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
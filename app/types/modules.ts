export interface ModuleType {
  type: 'MSP' | 'EN' | 'MAIN';
  weight: number;
  ects: number;
}

export interface ModuleGroup {
  name: string;
  modules: Registration[];
  ects: number;
  weightedGrade?: number;
  isOfficialGrade: boolean;
}

export interface ManualGrade {
  moduleName: string;
  grade: number;
  weight: number;
  ects: number;
  type: ModuleType['type'];
}

export interface Registration {
  modulanlassAnmeldungId: number;
  modulanlassId: number;
  studierendeId: number;
  statusId: number;
  statusName: string;
  freieNote: number | null;
  noteId: number | null;
  titelArbeit: string | null;
  text: string;
  anmeldungsDatum: string;
  hochschule: string;
  ausbildungsart: number;
  moduleType?: ModuleType;
  groupName?: string;
  modulanlass: {
    modulanlassId: number;
    modulId: number;
    nummer: string;
    bezeichnung: string;
    statusId: number;
    statusName: string;
    hochschule: string;
    ausbildungsart: number;
    maxTeilnehmende: number;
    datumVon: string;
    datumBis: string;
    wochentag: string | null;
    zeitVon: string | null;
    zeitBis: string | null;
    anzahlAnmeldung: number;
    anlassleitungen: {
      leitungsperson: {
        leitungspersonId: number;
        vorname: string;
        nachname: string;
        email: string;
        telefon: string | null;
      };
      leitungsrolleId: number;
      leitungsrolleBezeichnung: string;
    }[];
  };
  bestanden: boolean | null;
  noteBezeichnung: string | null;
}

export interface GradeDistribution {
  range: string;
  count: number;
  color: string;
  key: string;
}

export interface ModuleProgress {
  completed: number;
  inProgress: number;
  total: number;
  percentage: number;
}

export interface ModuleStats {
  totalModules: number;
  completedModules: number;
  currentModules: number;
  averageGrade: string | null;
  weightedAverage: string | null;
  passedModules: number;
  totalStudents: number;
  uniqueLecturers: number;
  departments: number;
  totalCapacity: number;
  earliestModule: Date;
  latestModule: Date;
}

export interface NewManualGrade extends ManualGrade {
  isExistingModule: boolean;
}

// Animation variants
export const tutorialStepVariants = {
  hidden: { 
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: -20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}; 
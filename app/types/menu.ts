export interface MenuItem {
  title: string;
  description: string;
  prices: {
    student: number;  // M.FH price
    regular: number;  // O.FH price
  };
  allergens: string[];
  isVegan: boolean;
  isVegetarian: boolean;
  nutritionInfo?: {
    kcal: number;
    carbs: number;
    protein: number;
    fat: number;
    percentages?: {
      kcal: number;
      carbs: number;
      protein: number;
      fat: number;
    }
  };
  origin?: string;
}

export interface DailyMenu {
  date: Date;
  items: MenuItem[];
}

export const ALLERGEN_MAP: { [key: string]: string } = {
  "1": "Glutenhaltiges Getreide",
  "2": "Krebstiere",
  "3": "Eier",
  "4": "Fische",
  "5": "Erdnüsse",
  "6": "Sojabohnen",
  "7": "Milch, einschliesslich Laktose",
  "8": "Hartschalenobst / Nüsse",
  "9": "Sellerie",
  "10": "Senf",
  "11": "Sesamsamen",
  "12": "Schwefeldioxid / Sulfite",
  "13": "Lupinen",
  "14": "Weichtiere"
}; 
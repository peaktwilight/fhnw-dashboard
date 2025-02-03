import { DailyMenu } from '../types/menu';

export async function getMenu(date?: Date): Promise<DailyMenu> {
  try {
    const response = await fetch('/api/menu' + (date ? `?date=${date.toISOString()}` : ''));
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}

export async function getMenuForToday(): Promise<DailyMenu> {
  return getMenu(new Date());
}

// TODO: Implement actual scraping logic
// This function will be implemented to fetch and parse the actual menu data
export async function scrapeMenuData(): Promise<DailyMenu> {
  throw new Error("Not implemented yet");
} 
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
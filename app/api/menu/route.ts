import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { MenuItem } from '@/app/types/menu';
import { parse, isSameDay, isValid } from 'date-fns';
import { de } from 'date-fns/locale';

export async function GET(request: Request) {
  try {
    // Get date from query parameters
    const searchParams = new URL(request.url).searchParams;
    const dateParam = searchParams.get('date');
    
    const targetDate = dateParam ? new Date(dateParam) : new Date();

    // Validate the date
    if (!isValid(targetDate)) {
      return NextResponse.json(
        {
          error: 'Invalid date provided',
          date: dateParam,
          items: []
        },
        { status: 400 }
      );
    }

    // If the provided date does not include a year, use the current year
    if (dateParam && !/\d{4}/.test(dateParam)) {
      targetDate.setFullYear(new Date().getFullYear());
    }

    // Construct URL for fetching the menu
    const url = 'https://fhnw.sv-restaurant.ch/de/menuplan/';

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    if (!html) {
      throw new Error('Empty response from menu website');
    }

    const $ = cheerio.load(html);
    const menuItems: MenuItem[] = [];

    // Iterate over each menu tab (now using the .menu-plan-grid selector)
    $('.menu-plan-tabs .menu-plan-grid').each((_, tab) => {
      // Get the tab ID (e.g. "menu-plan-tab1") and extract the number
      const tabIdFull = $(tab).attr('id');
      if (!tabIdFull) return;
      const tabNum = tabIdFull.replace('menu-plan-tab', '');

      // Look up the corresponding date from the day navigation label
      const dateLabel = $(`.day-nav label[for="mp-tab${tabNum}"] .date`).text().trim();
      if (!dateLabel) return;

      // The date label is in the format "03.02." – remove any trailing dot and append the current year.
      const cleanedDate = dateLabel.replace(/\.$/, '');
      const fullDateString = cleanedDate + '.' + new Date().getFullYear(); // e.g. "03.02.2025"
      const parsedDate = parse(fullDateString, 'dd.MM.yyyy', new Date(), { locale: de });

      // Only process this tab if the parsed date matches the target date
      if (!isValid(parsedDate) || !isSameDay(parsedDate, targetDate)) {
        return;
      }

      // Process each menu item within this tab
      $(tab)
        .find('.menu-item')
        .each((_, element) => {
          const $element = $(element);
          const title = $element.find('.menu-title').text().trim();
          const description = $element.find('.menu-description').text().trim();

          // Extract prices by matching both price formats
          const pricesText = $element.find('.menu-prices').text();
          const prices = {
            student: parseFloat(pricesText.match(/(\d+\.\d+)\s*M\.FH/)?.[1] || '0'),
            regular: parseFloat(pricesText.match(/(\d+\.\d+)\s*O\.FH/)?.[1] || '0')
          };

          // Check for dietary preferences
          const isVegan = $element.find('.label-vegan').length > 0;
          const isVegetarian =
            $element.find('.label-vegetarian').length > 0 || isVegan;

          // Extract allergens information
          const allergenText = $element.find('.allergen-info .allergen').text();
          const allergenMatch = allergenText.match(/Allergene:\s*(.+)/);
          const allergens = allergenMatch
            ? allergenMatch[1]
                .split(',')
                .map(num => num.trim().replace(/\D/g, ''))
            : [];

          // Extract the origin information if available
          const origin = $element.find('.menu-provenance').text().trim();

          // Extract nutrition info if present
          let nutritionInfo;
          const nutritionTable = $element.find('.nutrition-table');
          if (nutritionTable.length) {
            const values = nutritionTable
              .find('tr')
              .eq(1)
              .find('td')
              .map((_, td) => parseFloat($(td).text().trim()))
              .get();

            const percentages = nutritionTable
              .find('tr.percentage td')
              .map((_, td) =>
                parseInt($(td).text().replace('%', ''), 10)
              )
              .get();

            nutritionInfo = {
              kcal: values[0] || 0,
              carbs: values[1] || 0,
              protein: values[2] || 0,
              fat: values[3] || 0,
              percentages: {
                kcal: percentages[0] || 0,
                carbs: percentages[1] || 0,
                protein: percentages[2] || 0,
                fat: percentages[3] || 0
              }
            };
          }

          // Only add items with a title
          if (title) {
            menuItems.push({
              title,
              description,
              prices,
              allergens,
              isVegan,
              isVegetarian,
              nutritionInfo,
              ...(origin && { origin })
            });
          }
        });
    });

    if (menuItems.length === 0) {
      return NextResponse.json({
        date: targetDate.toISOString(),
        items: [],
        message: 'No menu available for this date'
      });
    }

    return NextResponse.json({
      date: targetDate.toISOString(),
      items: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}

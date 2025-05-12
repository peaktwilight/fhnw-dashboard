# Release v1.2.0 - May 2025

## 🚀 New Features

- **Enhanced SEO Optimization**
  - Added comprehensive SEO metadata with locale-specific titles and descriptions
  - Created structured data using schema.org markup for better search engine understanding
  - Added canonical URLs and language alternates for proper multilingual SEO
  - Added sitemap.xml and robots.txt for improved search engine crawling
  - Created optimized About page with SEO-friendly content in both languages

- **Improved UI Animations**
  - Implemented centralized animation utilities for consistent motion across components
  - Added smooth page transitions between routes for a more polished user experience
  - Enhanced loading states with sophisticated multi-layer spinner animations
  - Improved hover and interaction animations for all interactive elements

## 🛠️ Enhancements

- **Improved Date Handling**
  - Added robust date formatting with server/client consistency
  - Created FormattedDate component for reusable, locale-aware date display
  - Fixed hydration mismatches in date rendering
  - Added proper time zone handling for build timestamps

- **Performance Improvements**
  - Optimized client-side hydration to prevent mismatches
  - Added proper HTTP caching headers for better performance
  - Improved image loading with fallbacks for News items
  - Enhanced lazy loading for dynamic components

- **Code Quality**
  - Fixed all ESLint errors and warnings
  - Improved TypeScript type safety
  - Enhanced error handling across components
  - Better code organization with reusable utilities

## 📚 Technical Details

- Added build time and version information to the footer
- Improved internationalization with proper locale detection
- Enhanced metadata generation with dynamic locale support
- Added custom 404 page with internationalization
- Implemented ThemeScript improvements for dark mode

## 🐛 Bug Fixes

- Fixed image path issues with news fallback images
- Resolved hydration mismatches in date rendering
- Fixed inconsistent animation timing
- Corrected various layout issues in mobile view
- Addressed accessibility concerns with proper semantic HTML

---

📋 Full list of changes can be viewed in the commit history.
🔗 Live demo: https://fhnw.doruk.ch
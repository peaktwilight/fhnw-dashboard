# Release v1.2.1 - May 2025

## ⚡️ Performance Improvements

- **Dual-Layer Weather Data Caching**
  - Added server-side caching for weather API to reduce API calls
  - Implemented browser-side localStorage caching for faster initial loads
  - Set proper Cache-Control headers for HTTP-level cache optimization
  - Added timestamp tracking and cache validation for data freshness

## 🛠️ Technical Enhancements

- **Server Optimization**
  - Reduced external API calls to the OpenWeather API
  - Added better error handling for API responses
  - Implemented cache cleanup to prevent memory leaks
  - Improved response status validation

- **Client-Side Improvements**
  - Reduced loading state flickering through smart cache use
  - Added graceful fallback for localStorage errors
  - Better stateful mounting logic to prevent unnecessary renders
  - Enhanced error retry mechanism

## 📊 Impact

- Up to 30 minutes of cached weather data on the client
- Reduced API calls by up to 90% through server-side caching
- Improved initial load times with instant data from localStorage
- Lower bandwidth usage and external API consumption

---

📋 Full list of changes can be viewed in the commit history.
🔗 Live demo: https://fhnw.doruk.ch
@echo off
echo Starting Climate AI Platform with Sustainability Features...
echo.
echo Setting up environment...
set NODE_ENV=development
set PORT=5000

echo.
echo Starting server on port %PORT%...
echo.
echo The application will be available at:
echo http://localhost:%PORT%
echo.
echo Features available:
echo - Main Dashboard with Sustainability Overview
echo - Job Marketplace Dashboard
echo - Cultural Heritage Dashboard  
echo - Economic Equity Dashboard
echo - Real-time 3D Sustainability Globe
echo - Live Metrics Updates
echo.

npx tsx server/index.ts

pause

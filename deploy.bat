@echo off
chcp 65001 >nul
title Dark AI DDoS Kit Deployer
color 0a

echo ╔══════════════════════════════════════╗
echo ║   DARK AI DDoS KIT DEPLOYMENT       ║
echo ╚══════════════════════════════════════╝
echo.

:menu
echo [1] Deploy to GitHub Pages
echo [2] Deploy to Vercel (Recommended)
echo [3] Deploy to Netlify
echo [4] Run Local Server
echo [5] Build All-in-One Package
echo [6] Exit
echo.
set /p choice="Select option: "

if "%choice%"=="1" goto github
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto netlify
if "%choice%"=="4" goto local
if "%choice%"=="5" goto build
if "%choice%"=="6" exit
goto menu

:github
echo Deploying to GitHub Pages...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/gitname/react-gh-pages/master/scripts/init-gh-pages.sh' -OutFile 'deploy.sh'"
bash deploy.sh
goto menu

:vercel
echo Deploying to Vercel...
npm install -g vercel
vercel --prod
goto menu

:netlify
echo Deploying to Netlify...
npm install -g netlify-cli
netlify deploy --prod
goto menu

:local
echo Starting local server...
npm install
node server.js
goto menu

:build
echo Building all-in-one package...
mkdir "Dark AI DDoS Kit"
copy index.html "Dark AI DDoS Kit\"
copy server.js "Dark AI DDoS Kit\"
copy package.json "Dark AI DDoS Kit\"
copy deploy.bat "Dark AI DDoS Kit\"
echo Build complete! Check "Dark AI DDoS Kit" folder.
pause
goto menu
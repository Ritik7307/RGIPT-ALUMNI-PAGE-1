@echo off
echo ========================================
echo RGIPT Alumni Portal Server Setup
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    echo PORT=3000 > .env
    echo MONGODB_URI=mongodb://localhost:27017/rgipt-alumni >> .env
    echo EMAIL_USER=your-gmail@gmail.com >> .env
    echo EMAIL_PASSWORD=your-app-password >> .env
    echo ADMIN_EMAIL=24mc3040@rgipt.ac.in >> .env
    echo.
    echo IMPORTANT: Please edit .env file with your Gmail credentials!
    echo You need to:
    echo 1. Go to https://myaccount.google.com/apppasswords
    echo 2. Create an app password for "Mail"
    echo 3. Replace "your-gmail@gmail.com" and "your-app-password" in .env file
    echo.
    pause
)

echo Starting server on port 3000...
echo Open http://localhost:3000 in your browser
echo.
node server.js



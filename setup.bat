@echo off
echo 🔧 Setting up your DeepF4ke Web App...

:: Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python and try again.
    exit /b
)

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js and try again.
    exit /b
)

:: Ensure required upload directories exist
echo 📂 Ensuring required folders exist...
mkdir server\uploads\faces
mkdir server\uploads\reels
mkdir server\uploads\outputs
mkdir server\uploads\frames

:: Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

:: Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install

echo ✅ Setup complete! You can now run the app using:
echo 🔹 npm start
pause

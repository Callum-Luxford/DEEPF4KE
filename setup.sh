#!/bin/bash

echo "🔧 Setting up your DeepF4ke Web App..."

# Check if Python is installed
if ! command -v python3 &>/dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &>/dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Setup complete! You can now run the app."

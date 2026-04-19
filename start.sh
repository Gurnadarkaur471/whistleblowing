#!/bin/bash

echo ""
echo "====================================================="
echo "  SecureVoice – Anonymous Whistleblowing System"
echo "====================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "[ERROR] Node.js not found! Install from: https://nodejs.org"
  exit 1
fi
echo "[OK] Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
  echo "[ERROR] npm not found!"
  exit 1
fi

# Create required directories
mkdir -p logs uploads
echo "[OK] Directories ready."

# Install dependencies
echo ""
echo "[1/3] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "[ERROR] npm install failed!"
  exit 1
fi
echo "[OK] Dependencies installed."

# Setup admin
echo ""
echo "[2/3] Setting up admin account..."
node setup.js

# Start server
echo ""
echo "[3/3] Starting SecureVoice..."
echo ""
echo "====================================================="
echo "  App running at : http://localhost:3000"
echo "  Admin panel    : http://localhost:3000/admin/login"
echo "  Admin Email    : admin@securevoice.gov"
echo "  Admin Password : Admin@SecureVoice2024"
echo "====================================================="
echo ""
node server.js

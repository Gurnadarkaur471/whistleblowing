#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting Render Build..."

# Install Chromium dependencies
apt-get update
apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libxshmfence1

# 1. Install Node modules
npm install

# 2. Configure Puppeteer to use Render's persistent cache directory
export PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer

echo "Build Configuration Complete!"

#!/bin/bash

echo "🚀 Starting deployment..."

# 1. Pull latest code
echo "📥 Pulling latest changes..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Migrate database
echo "🗄️ Running migrations..."
npm run migrate

# 4. Restart process with PM2
echo "🔄 Restarting backend with PM2..."
pm2 restart ecosystem.config.cjs --env production

echo "✅ Deployment completed successfully!"

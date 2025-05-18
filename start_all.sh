#!/bin/bash

# Stop on first error
set -e

# Start Flask (your model API server)
echo "🚀 Starting Flask Model API Server on port 8000..."
cd ai-chaos-model
nohup python api_server.py > ../logs/model_api.log 2>&1 &
cd ..

# Start Socket.IO server
echo "🔌 Starting Socket.IO Server on port 4000..."
nohup node socket-server.js > logs/socket_server.log 2>&1 &

# Start Next.js frontend
echo "🎮 Starting Next.js Frontend on port 3000..."
npm run dev
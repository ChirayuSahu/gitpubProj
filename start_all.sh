#!/bin/bash

# Start FastAPI (your model API server)
echo "🚀 Starting Model API Server (FastAPI) on port 8000..."
cd ai-chaos-model
python api_server.py &
cd ..

# Start Socket.IO server
echo "🔌 Starting Socket.IO Server on port 4000..."
node socket-server.js &

# Start Next.js frontend
echo "🎮 Starting Next.js Frontend on port 3000..."
npm run dev

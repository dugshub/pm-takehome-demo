#!/bin/bash

# AIIG Deliverables - Startup Script
# This script installs dependencies and launches both frontend and backend servers

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== AIIG Deliverables Startup ==="
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd "$SCRIPT_DIR/backend"
npm install

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install

echo ""
echo "Dependencies installed successfully!"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend server
echo "Starting backend server on port 3000..."
cd "$SCRIPT_DIR/backend"
npm run start:dev &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend server on port 5173..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=== Servers Started ==="
echo "Backend:  http://localhost:3000/api"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

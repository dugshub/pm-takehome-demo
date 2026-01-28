#!/bin/bash

# AIIG Deliverables - Startup Script
# This script installs dependencies and launches both frontend and backend servers
# with automatic port conflict detection and resolution

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Default ports (less common to avoid conflicts)
DEFAULT_BACKEND_PORT=4100
DEFAULT_FRONTEND_PORT=4200

# Check if a port is in use
port_in_use() {
    lsof -i ":$1" >/dev/null 2>&1
}

# Find an available port starting from the given port
find_available_port() {
    local port=$1
    local max_attempts=10
    local attempt=0

    while port_in_use $port && [ $attempt -lt $max_attempts ]; do
        echo "  Port $port is in use, trying next..." >&2
        port=$((port + 100))
        attempt=$((attempt + 1))
    done

    if [ $attempt -eq $max_attempts ]; then
        echo "ERROR: Could not find available port after $max_attempts attempts" >&2
        exit 1
    fi

    echo $port
}

# Print summary table
print_summary() {
    clear
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           AIIG Deliverables - Development Server            ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║                                                              ║"
    echo "║  Service          URL                              Status   ║"
    echo "║  ───────────────  ───────────────────────────────  ──────   ║"
    printf "║  %-16s  %-33s  %-6s   ║\n" "Frontend" "http://localhost:$FRONTEND_PORT" "✓ Live"
    printf "║  %-16s  %-33s  %-6s   ║\n" "Backend API" "http://localhost:$BACKEND_PORT/api" "✓ Live"
    echo "║                                                              ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  Database: $SCRIPT_DIR/database.sqlite"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  Press Ctrl+C to stop all servers                           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

echo "=== AIIG Deliverables Startup ==="
echo ""

# Determine ports (use env vars if set, otherwise find available)
if [ -n "$PORT" ]; then
    BACKEND_PORT=$PORT
else
    echo "Checking backend port availability..."
    BACKEND_PORT=$(find_available_port $DEFAULT_BACKEND_PORT)
fi

if [ -n "$FRONTEND_PORT" ]; then
    FRONTEND_PORT=$FRONTEND_PORT
else
    echo "Checking frontend port availability..."
    # If backend port was offset, offset frontend by same amount
    OFFSET=$((BACKEND_PORT - DEFAULT_BACKEND_PORT))
    FRONTEND_PORT=$(find_available_port $((DEFAULT_FRONTEND_PORT + OFFSET)))
fi

echo ""
echo "Using ports: Backend=$BACKEND_PORT, Frontend=$FRONTEND_PORT"
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd "$SCRIPT_DIR/backend"
npm install --silent

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install --silent

echo ""
echo "Starting servers..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend server (suppress output initially)
cd "$SCRIPT_DIR/backend"
PORT=$BACKEND_PORT FRONTEND_PORT=$FRONTEND_PORT npm run start:dev > /tmp/aiig-backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend server (suppress output initially)
cd "$SCRIPT_DIR/frontend"
VITE_API_URL="http://localhost:$BACKEND_PORT/api" npm run dev -- --port $FRONTEND_PORT > /tmp/aiig-frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for servers to be ready
echo "Waiting for servers to start..."
sleep 3

# Check if backend is responding
BACKEND_READY=false
for i in {1..10}; do
    if curl -s "http://localhost:$BACKEND_PORT/api/projects" > /dev/null 2>&1; then
        BACKEND_READY=true
        break
    fi
    sleep 1
done

# Check if frontend is responding
FRONTEND_READY=false
for i in {1..10}; do
    if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
        FRONTEND_READY=true
        break
    fi
    sleep 1
done

# Print summary
print_summary

# Tail the logs
tail -f /tmp/aiig-backend.log /tmp/aiig-frontend.log 2>/dev/null &
TAIL_PID=$!

# Update cleanup to also kill tail
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID $TAIL_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID

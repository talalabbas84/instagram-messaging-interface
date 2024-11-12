#!/bin/bash

echo "Starting setup..."

# Check if Redis is running natively
if ! command -v redis-server &> /dev/null || ! pgrep redis-server > /dev/null
then
    # If Redis is not installed or not running, check for Docker and start a Redis container
    if command -v docker &> /dev/null
    then
        echo "Redis is not running locally. Starting Redis with Docker..."
        docker run -d --name redis-container -p 6379:6379 redis
    else
        echo "Neither a local Redis server nor Docker is available. Please install Redis or Docker and try again."
        exit 1
    fi
else
    echo "Redis server is running locally."
fi

# Frontend Setup
echo "Setting up frontend..."
cd frontend

# Check if .env file exists; if not, create it
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://0.0.0.0:8000" > .env
    echo ".env file created in frontend with default API URL."
fi

npm install

# Open frontend in a new terminal based on OS
echo "Starting frontend..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e 'tell application "Terminal" to do script "cd \"'$PWD'\" && npm run dev"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    gnome-terminal -- bash -c "cd '$PWD' && npm run dev; exec bash"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    start "Frontend" bash -c "cd '$PWD' && npm run dev"
elif [[ "$OSTYPE" == "win32" ]]; then
    start cmd /c "cd /d '$PWD' && npm run dev"
fi
cd ..

# Backend Setup
echo "Setting up backend..."
cd backend

# Check if .env file exists; if not, create it with default values
if [ ! -f .env ]; then
    cat <<EOT >> .env
AGENTQL_API_KEY=
ENCRYPTION_KEY=s3d1cBB0-w1Sj3O6F7wGnh_X4vZg7RCdfE9JomjW5so=
JWT_SECRET_KEY=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_ENABLED=true
BROWSER_HEADLESS=true
EOT
    echo ".env file created in backend with default configuration."
fi

# Prompt for AGENTQL_API_KEY if not set
source .env
if [ -z "$AGENTQL_API_KEY" ]; then
    read -p "Enter your AGENTQL_API_KEY: " AGENTQL_API_KEY
    echo "AGENTQL_API_KEY=$AGENTQL_API_KEY" >> .env
fi

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt -r dev-requirements.txt

# Install AgentQL library
pip install agentql

# Install Playwright driver for Chromium
playwright install chromium

# Open backend in a new terminal based on OS
echo "Starting backend..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e 'tell application "Terminal" to do script "cd \"'$PWD'\" && source venv/bin/activate && uvicorn app.main:app --reload"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    gnome-terminal -- bash -c "cd '$PWD' && source venv/bin/activate && uvicorn app.main:app --reload; exec bash"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    start "Backend" bash -c "cd '$PWD' && source venv/bin/activate && uvicorn app.main:app --reload"
elif [[ "$OSTYPE" == "win32" ]]; then
    start cmd /c "cd /d '$PWD' && venv\\Scripts\\activate && uvicorn app.main:app --reload"
fi
cd ..

# Final confirmation
sleep 5  # Wait a few seconds to ensure terminals have launched

echo "Setup complete."

# Check if frontend and backend are running
FRONTEND_RUNNING=$(lsof -i :5173 | grep LISTEN)
BACKEND_RUNNING=$(lsof -i :8000 | grep LISTEN)

if [ -n "$FRONTEND_RUNNING" ] && [ -n "$BACKEND_RUNNING" ]; then
    echo "Both frontend and backend are running successfully."
    echo "Access the application via the following URLs:"
    echo "Frontend: http://localhost:5173"
    echo "Backend API Docs: http://localhost:8000/docs"
else
    echo "Error: It seems that one or both services failed to start."
    [ -z "$FRONTEND_RUNNING" ] && echo "Frontend is not running on port 5173."
    [ -z "$BACKEND_RUNNING" ] && echo "Backend is not running on port 8000."
fi

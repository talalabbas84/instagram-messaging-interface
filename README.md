```markdown
# Instagram Messaging Interface

This project is an Instagram Messaging Interface that allows users to securely log in, send messages via Instagram, and handle both manual and JSON-based API inputs. The backend is built with FastAPI, using Redis for session management, while the frontend leverages React with Vite, TailwindCSS, and ShadCN UI.

## Table of Contents
1. [Quick Setup](#quick-setup)
2. [Manual Setup](#manual-setup)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Tech Stack](#tech-stack)
6. [Prerequisites](#prerequisites)
7. [Environment Variables](#environment-variables)
8. [Usage](#usage)
9. [Future Improvements](#future-improvements)
10. [License](#license)

## Quick Setup

To quickly set up and run the project, follow these steps:

1. **Make the setup script executable**:
    ```bash
    chmod +x setup.sh
    ```

2. **Run the setup script**:
    ```bash
    ./setup.sh
    ```

This will:
- Install dependencies and set up environment variables for both frontend and backend.
- Start the frontend server at [http://localhost:5173](http://localhost:5173).
- Start the backend server at [http://localhost:8000](http://localhost:8000).

For backend API documentation, visit [http://localhost:8000/docs](http://localhost:8000/docs).

## Manual Setup

If you prefer a step-by-step approach, here’s how to manually set up and run the project:

### Frontend Setup

1. Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory with the following content:
    ```plaintext
    VITE_API_URL=http://0.0.0.0:8000
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

   The frontend will run at [http://localhost:5173](http://localhost:5173).

### Backend Setup

1. Navigate to the backend folder:
    ```bash
    cd backend
    ```

2. (Optional) Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt -r dev-requirements.txt
    ```

4. Create a `.env` file in the `backend` directory with the following content:
    ```plaintext
    # AgentQL and JWT configurations
    AGENTQL_API_KEY=your_api_key
    ENCRYPTION_KEY=s3d1cBB0-w1Sj3O6F7wGnh_X4vZg7RCdfE9JomjW5so=
    JWT_SECRET_KEY=your_secret_key

    # Redis configuration
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=your_password  # Leave blank if no password is set
    REDIS_ENABLED=true
    ```

5. Install the AgentQL library:
    ```bash
    pip install agentql
    ```

6. Install the Playwright driver for Chromium:
    ```bash
    playwright install chromium
    ```

7. Start the FastAPI development server:
    ```bash
    uvicorn app.main:app --reload
    ```

   The backend will run at [http://localhost:8000](http://localhost:8000). API documentation can be accessed at [http://localhost:8000/docs](http://localhost:8000/docs).

## Project Structure

```plaintext
instagram-messaging-interface/
├── backend/                    # Backend code for FastAPI
│   ├── app/                    # Core backend application
│   ├── tests/                  # Test files for backend
│   ├── .env                    # Environment variables for the backend
│   ├── requirements.txt        # Dependencies for production
│   ├── dev-requirements.txt    # Development dependencies
│   └── pyproject.toml          # Backend configuration for Black and other tools
├── frontend/                   # Frontend code for React
│   ├── src/                    # Source code for frontend
│   ├── .env                    # Environment variables for the frontend
│   ├── package.json            # NPM dependencies for the frontend
└── .github/
    └── workflows/              # GitHub Actions for CI/CD
```

## Features

- **Secure Login**: Supports Instagram login with session management via Redis.
- **Message Sending**: Allows sending messages to specified recipients with input validation and error handling.
- **Dual Input**: Supports manual entry and JSON-based API input for automation.
- **Session State**: Tracks session state to manage login persistence until logout.

## Tech Stack

### Frontend

- **React** (with TypeScript)
- **Vite** for fast builds and development
- **TailwindCSS** for styling
- **ShadCN UI** for reusable components

### Backend

- **FastAPI** for the REST API
- **AgentQL** for backend interaction with Instagram
- **Redis** for session management
- **Black** and **Flake8** for code formatting and linting

## Prerequisites

- **Redis**: Ensure Redis is installed and running, as it is required for session management.
- **Python 3.8+** and **Node.js** (for backend and frontend respectively)

## Environment Variables

### Backend `.env` Configuration

Refer to the backend `.env` configuration in the [Manual Setup](#manual-setup) section for details on setting up required environment variables.

## Usage

1. **Login**: Use the login form to enter Instagram credentials. If successful, a session will be created.
2. **Send Message**: After login, enter recipient details and the message, then send. The app handles errors, such as invalid credentials and recipient not found.
3. **JSON Input Mode**: Use JSON format for input data for automated message sending.

For backend API documentation, visit [http://localhost:8000/docs](http://localhost:8000/docs).

## Future Improvements

- **Dockerization**: Future plans include adding a stable Docker setup to containerize the frontend, backend, and Redis for easy deployment.
- **Unit Testing**: Add unit tests to ensure code reliability and maintainability.

## License

This project is licensed under the MIT License.

```

### Key Updates
- **Quick Setup Section**: Added at the top for users who prefer a single-command setup.
- **Manual Setup Section**: Detailed step-by-step setup instructions provided below Quick Setup.
- **Clear API Links**: Links to the frontend, backend, and API docs for easy access.

This layout provides both a quick and detailed setup path, making it easier for users to get started based on their preferences. Let me know if any further adjustments are needed!

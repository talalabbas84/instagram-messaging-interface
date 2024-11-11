```markdown
# Instagram Messaging Interface

This project is an Instagram Messaging Interface that allows users to securely log in, send messages via Instagram, and handle both manual and JSON-based API inputs. The backend is built with FastAPI, using Redis for session management, while the frontend leverages React with Vite, TailwindCSS, and ShadCN UI.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Environment Variables](#environment-variables)
6. [Setup and Installation](#setup-and-installation)
7. [Usage](#usage)
8. [Future Improvements](#future-improvements)
9. [License](#license)

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

Create a `.env` file in the `backend` directory with the following variables:

```plaintext
# AgentQL and JWT configurations
AGENTQL_API_KEY=
ENCRYPTION_KEY=s3d1cBB0-w1Sj3O6F7wGnh_X4vZg7RCdfE9JomjW5so=
JWT_SECRET_KEY=EnfLRdf-lqSDLdFWfOV9HgpplsQbYB1KofZQTBvnFdnmaQoadE7CRA

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password    # Leave this blank if no password is set
REDIS_ENABLED=true
```

### Frontend `.env` Configuration

Create a `.env` file in the `frontend` directory with the following variable:

```plaintext
# API URL for Backend
VITE_API_URL=http://0.0.0.0:8000
```

## Setup and Installation

### Frontend Setup

1. Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

### Backend Setup

1. Navigate to the backend folder:
    ```bash
    cd backend
    ```

2. (Optional) Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt -r dev-requirements.txt
    ```

4. Start the FastAPI development server:
    ```bash
    uvicorn app.main:app --reload
    ```

## Usage

1. **Login**: Use the login form to enter Instagram credentials. If successful, a session will be created.
2. **Send Message**: After login, enter recipient details and the message, then send. The app handles errors, such as invalid credentials and recipient not found.
3. **JSON Input Mode**: Use JSON format for input data for automated message sending.

## Future Improvements

- **Dockerization**: Future plans include adding a stable Docker setup to containerize the frontend, backend, and Redis for easy deployment.
- **Unit Testing**: Add unit tests to ensure code reliability and maintainability.

## License

This project is licensed under the MIT License.
```

### Key Points
- **Environment Variables**: Clear instructions for creating `.env` files in both `backend` and `frontend` directories based on your directory structure.
- **Future Improvements**: Dockerization and testing enhancements are suggested without detailed Docker setup to avoid current bugs.

This README should now be well-aligned with your project setup. Let me know if you need further customization!

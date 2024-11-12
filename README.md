# Instagram Messaging Interface

This project is an Instagram Messaging Interface that allows users to securely log in, send messages via Instagram, and handle both manual and JSON-based API inputs. The backend is built with FastAPI, using Redis for session management, while the frontend leverages React with Vite, TailwindCSS, and ShadCN UI.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Docker Setup](#docker-setup)
4. [Manual Setup](#manual-setup)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
5. [Project Structure](#project-structure)
6. [Features](#features)
7. [Tech Stack](#tech-stack)
8. [Environment Variables](#environment-variables)
9. [Usage](#usage)
10. [JSON Input Handling](#json-input-handling)
11. [Session State Management](#session-state-management)
12. [Future Improvements](#future-improvements)
13. [License](#license)

## Prerequisites

- **Docker**: Required if you prefer running the project in containers.
- **Redis**: Ensure Redis is installed and running if you are not using Docker.
- **Python 3.8+** and **Node.js**: Required for manual backend and frontend setup, respectively.

---

## Quick Setup

To quickly set up and run the project without Docker, follow these steps:

1. **Navigate to the project root directory** where the `setup.sh` script is located.

2. **Make the setup script executable**:
    ```bash
    chmod +x setup.sh
    ```

3. **Run the setup script**:
    ```bash
    ./setup.sh
    ```

This will:
- Install dependencies and set up environment variables for both frontend and backend.
- Start the frontend server at [http://localhost:5173](http://localhost:5173).
- Start the backend server at [http://localhost:8000](http://localhost:8000).

For backend API documentation, visit [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Docker Setup

If you prefer to run the project using Docker, follow these steps:

1. **Build and start the Docker containers**:
    ```bash
    docker-compose up --build
    ```

   This command will build the images and start the frontend, backend, and Redis services as defined in `docker-compose.yml`.

2. **Access the application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:8000](http://localhost:8000)
   - **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Environment Variables**: The `docker-compose.yml` file includes references to environment variables required by the application. Make sure you have the `.env` files configured in the `frontend` and `backend` directories or use the `.env.example` provided in each folder to set up your own.

4. **Stop Docker Containers**:
    ```bash
    docker-compose down
    ```

This setup allows you to quickly deploy the project using Docker, which simplifies dependency management and isolates each service in its own container.

---

## Manual Setup

If you prefer to set up each part individually without Docker, follow the manual setup instructions below.

### Frontend Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install frontend dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the `frontend` directory with the following content:
        ```plaintext
        VITE_API_URL=http://0.0.0.0:8000
        ```

4. **Start the frontend development server**:
    ```bash
    npm run dev
    ```

   The frontend will be accessible at [http://localhost:5173](http://localhost:5173).

### Backend Setup

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2. **(Optional) Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install backend dependencies**:
    ```bash
    pip install -r requirements.txt -r dev-requirements.txt
    ```

4. **Set up environment variables**:
    - Create a `.env` file in the `backend` directory with the following content:
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

5. **Install the AgentQL library**:
    ```bash
    pip install agentql
    ```

6. **Install the Playwright driver for Chromium**:
    ```bash
    playwright install chromium
    ```

7. **Start the FastAPI development server**:
    ```bash
    uvicorn app.main:app --reload
    ```

   The backend will be accessible at [http://localhost:8000](http://localhost:8000). API documentation can be accessed at [http://localhost:8000/docs](http://localhost:8000/docs).

---

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
- **JWT-Based Authentication**: Uses JSON Web Tokens (JWT) to securely communicate between the frontend and backend.

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
- **JWT** for secure communication between frontend and backend
- **Fernet Encryption** with TTL for secure session storage

## Environment Variables

### Backend `.env` Configuration

Refer to the backend `.env` configuration in the [Manual Setup](#manual-setup) section for details on setting up required environment variables.

## Usage

1. **Login**: Use the login form to enter Instagram credentials. If successful, a session will be created.
2. **Send Message**: After login, enter recipient details and the message, then send. The app handles errors, such as invalid credentials and recipient not found.
3. **JSON Input Mode**: Use JSON format for input data for automated message sending.

For backend API documentation, visit [http://localhost:8000/docs](http://localhost:8000/docs).

## JSON Input Handling

The interface supports JSON-based input, which allows automation and easy handling of multiple requests. This feature enables users to provide all required information (username, password, recipient, and message) as a JSON object. To utilize this feature, follow these steps:

1. **Switch to JSON Input Mode**: In the UI, toggle the input mode to JSON.
2. **Enter JSON**: Input data in the following JSON format:
    ```json
    {
      "username": "your_username",
      "password": "your_password",
      "recipient": "recipient_username",
      "message": "Your message here"
    }
    ```
3. **Submit**: The JSON input is parsed and used to automatically fill in the login and message fields. You can preview the input details before submission to ensure accuracy.

This feature simplifies handling of automated inputs, especially for repeated or batch messaging scenarios.

## Session State Management

To maintain user sessions and prevent unnecessary logins, this project utilizes Redis for session state management. Here's how session handling is managed:

1. **JWT-Based Authentication**: Upon a successful login, a JWT is generated and stored on the client side. This token is sent with every request to verify the user's identity and authorization.
2. **Redis for Session Storage**: In addition to JWT, session information is securely stored in Redis. Each session is encrypted using **Fernet encryption** for confidentiality and integrity, with a **time-to-live (TTL)** value to manage session expiration automatically.
3. **Token Validation and Refresh**: The app validates the access token before every request. If the token has expired, a refresh token is used to issue a new access token.
4. **Session Expiration**: Once a session expires in Redis, the user is required to re-authenticate, providing added security for sensitive data.

This approach ensures a secure and efficient session state, reducing unnecessary logins and maintaining robust security.

## Future Improvements

- **Improved Error Feedback**: Add more descriptive error messages in the UI for a better user experience.
- **Unit Testing**: Add unit tests to ensure code reliability and maintainability.

## License

This project is licensed under the MIT License.

---

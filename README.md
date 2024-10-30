# Comment System

A real-time comment system built with Node.js, Express, Socket.IO, SQLite, and React. This project demonstrates how to create a backend API for posting and fetching comments and a frontend UI to display comments in real-time using Socket.IO for live updates.

## Features

- User authentication (simple session-based login)
- Post comments with real-time updates
- View list of comments sorted by timestamp
- SQLite database for storing comments
- Backend API endpoints for login and comment management

## Technologies Used

- Backend: Node.js, Express, Socket.IO, SQLite
- Frontend: React, Axios, Material-UI for UI components
- Real-time data updates with Socket.IO

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [SQLite](https://www.sqlite.org/download.html)

### Installation

1. Clone this repository: `git clone https://github.com/utkarsh050505/NodeProject.git`
2. Navigate to the project directory

3. Install the dependencies for both the backend and frontend:
   - **Backend**: `npm install`
   - **Frontend**: `cd frontend && npm install`

### Running the Application

#### Backend

1. Start the backend server: `node server.js`
   The server will run at `http://localhost:3001`.

#### Frontend

1. Open a new terminal, navigate to the `frontend` folder: `cd frontend`

2. Start the frontend application: `npm start`
   The frontend app will open at `http://localhost:3000`.

### API Endpoints

- **Login**: `POST /api/login`  
  - Request: `{ "username": "your_username" }`  
  - Response: `{ "sessionId": "generated_session_id" }`
  
- **Get Comments**: `GET /api/comments`  
  - Response: Returns a list of comments ordered by timestamp.
  
- **Post Comment**: `POST /api/comments`  
  - Request: `{ "sessionId": "session_id", "comment": "your_comment" }`  
  - Response: Returns the newly posted comment.

### How to Use

1. Start the backend server by running `node server.js` in the main directory.
2. Start the frontend application by running `npm start` inside the `frontend` folder.
3. Open the frontend app (`http://localhost:3000`), enter a username, and log in.
4. Once logged in, you can post a comment, which will appear in real-time in the comments list.

# Nine2Five

The backend server for Nine2Five, a social platform designed for workers in retail, customer service, and other public-facing roles. The application provides a space where users can share their daily experiences, vent frustrations, and seek advice from peers who understand the challenges of working the 9-to-5 grind.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [WebSocket Messaging](#websocket-messaging)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## Features

- **Posts Management**: Users can create, view, edit, and delete their own posts.
- **Comments Management**: Users can create, edit, and delete their own comments. They can also view comments from other users on other posts as well.
- **Authentication**: Secure login using JWT tokens.
- **Role-Based Access**: Users and Admins have different access permissions based on their roles.
- **User Management**: Users with admin rights can create and delete any user. They can also edit certain information on a user's profile as well.
- **Jobs Management**: Users can dynamically add jobs to the database. When a user signs up, and if their job title isn't listed in the database, it is automatically created and added upon account creation.

## Technologies Used

- **Frontend**: React.js with Vite for fast development and optimized builds.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ORM.
- **Authentication**: JWT (JSON Web Tokens).
- **Styling**: CSS.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v14.x or later.
- **npm**: v6.x or later.
- **MongoDB**: A running MongoDB instance, either local or cloud-based (e.g., MongoDB Atlas).
- **Git**: To clone the repository.
- **Vite**: For frontend development.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zacharybaca/nine2five.git

2. **Navigate to the project directory**:
   ```bash
   cd server

3. **Install backend dependencies**:
   ```bash
   npm install

4. **Navigate to the frontend directory**:
   ```bash
   cd client

5. **Install frontend dependencies**:
   ```bash
   npm install

6. **Create a <code>.env</code> file in the root directory with the following contents**:
   ```bash
   MONGODB_URI=<your-mongodb-uri>
   SECRET=<your-jwt-secret>
   PORT=9000
   NODE_ENV=development

7. **Optional: If using MongoDB locally, ensure the service is running**:
   ```bash
   mongod

## Running the Application

1. **Start the backend server**:
   ```bash
   npm run dev
   ```

2. **Start the frontend development server**:
   ```bash
   cd client
   npm start
   ```
   
- The backend API will run at <code>http://localhost:5000</code>.
- The frontend will be accessible at <code>http://localhost:3000</code>.

# API Documentation

## User Management

   1. Get All Users
      - <code>GET /api/users</code>
      - Retrieves a list of all users.
      - Example Response:
         ```bash
         [
            {
               "_id": "taskId123",
               "title": "Fix login issue",
               "description": "Resolve authentication bug in login",
               "assignedEmployee": "employeeId456",
               "taskCompleted": false
            }
         ]

   2. Get a Specific Task
      - <code>GET /api/tasks/:id</code>
      - Retrieves a task by its unique ID.

   3. Create a New Task
      - <code>POST /api/tasks</code>
      - Requires the task data in the request body.
      - Example Request Body:
         ```bash
         {
            "title": "Fix CSS issue",
            "description": "Resolve layout alignment",
            "assignedEmployee": "employeeId456"
         }

   4. Update an Existing Task
      - <code>PUT /api/tasks/:id</code>
      - Updates the details of an existing task.

   5. Delete a Task
      - <code>DELETE /api/tasks/:id</code>
      - Deletes a task by ID.

   6. Retrieve Unassigned Tasks
      - <code>GET /api/tasks/unassigned</code>
      - Retrieves All Tasks That Hasn't Been Assigned An Employee

## Employee Management
   
   1. Get All Employees
      - <code>GET /api/employees</code>
      - Retrieves a list of all employees.

   2. Get a Specific Employee
      - <code>GET /api/employees/:id</code>
      - Retrieves employee details by their unique ID.

   3. Update an Employee's Information
      - <code>PUT /api/employees/:id</code>
      - Updates employee details by their unique ID.

   4. Delete an Employee
      - <code>DELETE /api/employees/:id</code>
      - Deletes an employee from the system, as well as unassign the tasks that employee was assigned.

## Authentication

   1. Login
      - <code>POST /api/auth/login</code>
      - Authenticates the user and returns a JWT token.
      - Example Request Body:
         ```bash
         {
            "email": "user@example.com",
            "password": "password123"
         }

   2. Register A New Employee in the System
      - <code>POST /api/employees/signup</code>
      - Adds a new employee to the database.

## WebSocket Messaging
   1. Server That Provides Real Time Communication for the Built-In Messaging System
      - <code>ws://localhost:9000</code>
      - Real-time chat communication and user online status updates.
      - Typing indicator feature that shows which user is currently typing a message.

# Project Structure
  - Structure of How Project File System is Set Up
   ```bash
   software-bug-tracker/
   ├── client/               # Frontend (React with Vite)
   ├── server/               # Backend (Node.js + Express)
   ├── models/               # Mongoose schemas for tasks and employees
   ├── routes/               # API route definitions
   ├── utils/                # Helper functions and middlewares
   └── README.md             # Project documentation
   ```

# Deployment
   1. The application is deployed on Render.
      - Configure the environment variables on Render to match your <code>.env</code> file.

# Future Enhancements
   - Email Notifications: Notify users when tasks are assigned or updated.
   - Priority and due date filters.
   - Better chatbot NLP and response context.

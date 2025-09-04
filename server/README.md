<p align="center">
  <img src="./High-Resolution-Color-Logo.png" height="300px"/>
</p>

# Nine2Five

The backend server for Nine2Five, a social platform designed for workers in retail, customer service, and other public-facing roles. The application provides a space where users can share their daily experiences, vent frustrations, and seek advice from peers who understand the challenges of working the 9-to-5 grind.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Notes for Frontend Integration](#notes-for-frontend-integration)
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

---

## **1. Users Routes (`/api/users`)**

| Method | Endpoint | Description | Access | Request Body | Response |
|--------|---------|-------------|--------|--------------|----------|
| GET | `/` | Get all users | Private (admin) | None | Array of users (id, username, name, avatarUrl, role, etc.) |
| GET | `/:id` | Get a single user by ID | Private | None | User object with selected fields (no password) |
| PUT | `/:id` | Update user info | Private (self/admin) | JSON: `{ username?, name?, avatarUrl?, role? }` | Updated user object |
| DELETE | `/:id` | Delete a user | Private (admin) | None | `{ message: "User deleted successfully" }` |

---

## **2. Auth Routes (`/api/auth`)**

| Method | Endpoint | Description | Access | Request Body | Response |
|--------|---------|-------------|--------|--------------|----------|
| POST | `/login` | Login user | Public | JSON: `{ username, password }` | JWT token and user info |
| POST | `/register` | Register new user | Public | JSON: `{ username, password, name, avatarUrl? }` | Created user object + token |
| POST | `/logout` | Logout user | Private | None | `{ message: "Logged out successfully" }` |

---

## **3. Posts Routes (`/api/posts`)**

| Method | Endpoint | Description | Access | Request Body / Query | Response |
|--------|---------|-------------|--------|--------------------|----------|
| POST | `/` | Create a new post | Private (logged-in) | JSON: `{ content, imageUrl?, anonymous?, tags? }` | Created post object with author info and reactionCounts |
| GET | `/` | Get all posts | Private | Query: `?withReactions=true` (optional) | Array of post objects with author info and reactionCounts |
| GET | `/:id` | Get a single post | Private | Query: `?withReactions=true` (optional) | Single post object with author info and reactionCounts |
| PUT | `/:id` | Update a post | Private (owner/admin) | JSON: `{ content, imageUrl?, anonymous?, tags? }` | Updated post object |
| DELETE | `/:id` | Soft delete post | Private (owner/admin) | None | `{ message: "Post deleted successfully (soft delete)" }` |

---

## **4. Reactions Routes (nested under posts)**

| Method | Endpoint | Description | Access | Request Body | Response |
|--------|---------|-------------|--------|--------------|----------|
| POST | `/:id/reactions` | Add or update a reaction to a post | Private | JSON: `{ type: "like"|"love"|"haha"|"wow"|"sad"|"angry" }` | Created/updated reaction object with populated user info |
| DELETE | `/:id/reactions` | Remove current user's reaction from a post | Private | None | `{ message: "Reaction removed successfully" }` |

---

## **5. Comments Routes (`/api/comments`)** *(if implemented)*

| Method | Endpoint | Description | Access | Request Body | Response |
|--------|---------|-------------|--------|--------------|----------|
| POST | `/` | Create a comment for a post | Private | JSON: `{ postId, content }` | Created comment with populated user info |
| GET | `/:postId` | Get all comments for a post | Private | None | Array of comment objects for the post |
| PUT | `/:id` | Update a comment | Private (owner/admin) | JSON: `{ content }` | Updated comment object |
| DELETE | `/:id` | Delete a comment | Private (owner/admin) | None | `{ message: "Comment deleted successfully" }` |

---

## **6. Route Flow Summary**

```bash
/api/users
├─ GET / → get all users (admin)
├─ GET /:id → get single user
├─ PUT /:id → update user
├─ DELETE /:id → delete user (admin)

/api/auth
├─ POST /login → login
├─ POST /register → register
├─ POST /logout → logout

/api/posts
├─ POST / → create post
├─ GET / → get all posts
├─ GET /:id → get single post
├─ PUT /:id → update post
├─ DELETE /:id → soft delete post
├─ POST /:id/reactions → add/update reaction
├─ DELETE /:id/reactions → remove reaction

/api/comments
├─ POST / → create comment
├─ GET /:postId → get comments for post
├─ PUT /:id → update comment
├─ DELETE /:id → delete comment
```

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


---

# Notes for Frontend Integration

1. Use `?withReactions=true` when fetching posts to include detailed reactions.
2. Reactions are nested under posts, no separate reaction routes are required.
3. Comments are fetched per post via `/api/comments/:postId`.
4. Soft deletion is used for posts; deleted posts have `isDeleted=true`.
5. Only owners or admins can update/delete posts, comments, or users.
6. Admin users can access all users; regular users can only update their own info.
7. Use JWT tokens in headers for all private routes:
    Authorization: Bearer <token>
8. Posts support withReactions=true query to fetch reaction details.
9. Soft delete means deleted posts have isDeleted=true but still exist in DB.
10. Admin users can access all users and delete posts/comments.
11. Reactions are one per user per post (upserted).

---

# Future Enhancements
   - Email Notifications: Notify users when tasks are assigned or updated.
   - Priority and due date filters.
   - Better chatbot NLP and response context.

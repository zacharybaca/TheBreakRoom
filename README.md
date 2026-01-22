<!-- markdownlint-disable MD033 -->

<p align="center">
  <img src="./logo.png" alt="Nine2Five Logo" width="280" />
</p>

<h1 align="center">The BreakRoom</h1>

<p align="center">
  <strong>The platform for the people who keep things moving.</strong><br />
  <em>From the breakroom to the world — we speak.</em>
</p>

---

<!-- markdownlint-enable MD033 -->

The backend server for The Breakroom, a social platform designed for workers in retail, customer service, and other public-facing roles. The application provides a space where users can share their daily experiences, vent frustrations, and seek advice from peers who understand the challenges of working the 9-to-5 grind.

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

## Features

- **Posts Management**: Users can create, view, edit, and delete their own posts.
- **Comments Management**: Users can create, edit, and delete their own comments. They can also view comments from other users on other posts as well.
- **Authentication**: Secure login using JWT tokens.
- **Role-Based Access**: Users and Admins have different access permissions based on their roles.
- **User Management**: Users with admin rights can create and delete any user. They can also edit certain information on a user's profile as well.
- **Jobs Management**: Users can dynamically add jobs to the database. When a user signs up, and if their job title isn't listed in the database, it is automatically created and added upon account creation.
- **Breakrooms**: A community-style feature where users can join groups that relate to their job, industry, or shared interests. Breakrooms act as smaller spaces within Nine2Five for more focused discussions.

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
   git clone https://github.com/zacharybaca/TheBreakRoom.git

   ```

2. **Navigate to the project directory**:

   ```bash
   cd server

   ```

3. **Install backend dependencies**:

   ```bash
   npm install

   ```

4. **Navigate to the frontend directory**:

   ```bash
   cd client

   ```

5. **Install frontend dependencies**:

   ```bash
   npm install

   ```

6. **Create a `.env` file in the root directory with the following contents**:

   ```bash
    PORT=5000
    SECRET=""
    ACCESS_TOKEN_SECRET=""
    REFRESH_TOKEN_SECRET=""
    NODE_ENV=production
    MONGODB_URI=mongodb+srv://bacazachary:[YOUR_PASSWORD]@cluster0.ij6c4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    DB_NAME=Nine2Five
    SMTP_HOST=smtp.yourprovider.com
    SMTP_PORT=587
    SMTP_USER=apikey-or-username
    SMTP_PASS=supersecretpassword
    EMAIL_FROM="The Breakroom <no-reply@zachary-baca.dev>"
    NODE_ENV=development || production
    FRONTEND_URL=https://yourfrontend.com
    SENDGRID_API_KEY=""
   ```

7. **Optional: If using MongoDB locally, ensure the service is running**:

   ```bash
   mongod
   ```

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

- The backend API will run at `http://localhost:5000`.
- The frontend will be accessible at `http://localhost:5173`.

## API Documentation

---

## **1. Users Routes (`/api/users`)**

| Method | Endpoint      | Description                            | Access                  | Request Body                                          | Response                                                         |
| ------ | ------------- | -------------------------------------- | ----------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| GET    | `/`           | Get all users                          | Private (admin)         | None                                                  | Array of users (id, username, name, avatarUrl, role, job, etc.)  |
| GET    | `/:id`        | Get a single user by ID                | Private                 | None                                                  | User object with selected fields (no password)                   |
| PUT    | `/:id`        | Update user info                       | Private (self/admin)    | JSON: `{ username?, name?, avatarUrl?, role?, job? }` | Updated user object                                              |
| DELETE | `/:id`        | Delete a user and their posts/comments | Private (admin or self) | None                                                  | `{ message: "User and related data deleted successfully" }`      |
| POST   | `/:id/avatar` | Upload/Update User Avatar              | Private (admin or self) | multipart/form-data                                   | `{ message: "Avatar uploaded successfully", avatarUrl: string }` |

---

## **2. Auth Routes (`/api/auth`)**

| Method | Endpoint    | Description       | Access  | Request Body                                          | Response                                 |
| ------ | ----------- | ----------------- | ------- | ----------------------------------------------------- | ---------------------------------------- |
| POST   | `/login`    | Login user        | Public  | JSON: `{ username, password }`                        | JWT token and user info                  |
| POST   | `/register` | Register new user | Public  | JSON: `{ username, password, name, avatarUrl?, job }` | Created user object + token              |
| POST   | `/logout`   | Logout user       | Private | None                                                  | `{ message: "Logged out successfully" }` |

---

## **3. Posts Routes (`/api/posts`)**

| Method | Endpoint | Description       | Access                | Request Body / Query                              | Response                                                  |
| ------ | -------- | ----------------- | --------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| POST   | `/`      | Create a new post | Private (logged-in)   | JSON: `{ content, imageUrl?, anonymous?, tags? }` | Created post object with author info and reactionCounts   |
| GET    | `/`      | Get all posts     | Private               | Query: `?withReactions=true` (optional)           | Array of post objects with author info and reactionCounts |
| GET    | `/:id`   | Get a single post | Private               | Query: `?withReactions=true` (optional)           | Single post object with author info and reactionCounts    |
| PUT    | `/:id`   | Update a post     | Private (owner/admin) | JSON: `{ content, imageUrl?, anonymous?, tags? }` | Updated post object                                       |
| DELETE | `/:id`   | Soft delete post  | Private (owner/admin) | None                                              | `{ message: "Post deleted successfully (soft delete)" }`  |

---

## **4. Reactions Routes (nested under posts)**

| Method | Endpoint         | Description                                | Access  | Request Body                                                              | Response                                                 |
| ------ | ---------------- | ------------------------------------------ | ------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| POST   | `/:id/reactions` | Add or update a reaction to a post         | Private | JSON: `{ type: "like" \| "love" \| "haha" \| "wow" \| "sad" \| "angry" }` | Created/updated reaction object with populated user info |
| DELETE | `/:id/reactions` | Remove current user's reaction from a post | Private | None                                                                      | `{ "message": "Reaction removed successfully" }`         |
| GET    | `/:id/reactions` | Get current user's reaction from a post    | Private | None                                                                      | User's Reactions                                         |

---

## **5. Comments Routes (`/api/comments`)**

| Method | Endpoint   | Description                 | Access                | Request Body                | Response                                      |
| ------ | ---------- | --------------------------- | --------------------- | --------------------------- | --------------------------------------------- |
| POST   | `/`        | Create a comment for a post | Private               | JSON: `{ postId, content }` | Created comment with populated user info      |
| GET    | `/:postId` | Get all comments for a post | Private               | None                        | Array of comment objects for the post         |
| PUT    | `/:id`     | Update a comment            | Private (owner/admin) | JSON: `{ content }`         | Updated comment object                        |
| DELETE | `/:id`     | Delete a comment            | Private (owner/admin) | None                        | `{ message: "Comment deleted successfully" }` |

---

## **6. Jobs Routes (`/api/jobs`)**

| Method | Endpoint | Description      | Access               | Request Body      | Response                                  |
| ------ | -------- | ---------------- | -------------------- | ----------------- | ----------------------------------------- |
| POST   | `/`      | Create a new job | Private (admin only) | JSON: `{ title }` | Created job object                        |
| GET    | `/`      | Get all jobs     | Public               | None              | Array of job objects                      |
| GET    | `/:id`   | Get a job by ID  | Public               | None              | Job object                                |
| PUT    | `/:id`   | Update a job     | Private (admin only) | JSON: `{ title }` | Updated job object                        |
| DELETE | `/:id`   | Delete a job     | Private (admin only) | None              | `{ message: "Job deleted successfully" }` |

---

## **7. BreakRoom Routes (`/api/breakrooms`)**

| Method | Endpoint     | Description                  | Access               | Request Body                          | Response                                     |
| ------ | ------------ | ---------------------------- | -------------------- | ------------------------------------- | -------------------------------------------- |
| POST   | `/`          | Create a new breakroom       | Private (admin only) | JSON: `{ name, secription, jobTags }` | Created breakroom object                     |
| GET    | `/`          | Get all breakrooms           | Private              | None                                  | Array of breakroom objects                   |
| GET    | `/:id`       | Get a single breakroom by ID | Private              | None                                  | Breakroom object                             |
| POST   | `/:id/join`  | Join a breakroom             | Private (logged-in)  | JSON: `{ title }`                     | Updated job object                           |
| POST   | `/:id/leave` | Leave a breakroom            | Private (logged-in)  | None                                  | `{ message: "Left breakroom successfully" }` |

---

### 📝 Notes

- Jobs are referenced by users on registration (`job` field).
- If a user registers with a job title that doesn’t exist yet, it’s **automatically created** in the database.

---

### 📝 Notes about avatar upload

- File must be an image ( jpeg, jpg, png, gif ), max 5MB.
- On success, the user's avatarUrl is updated to /uploads/filename.ext.
- Frontend can load it via: <http://localhost:5000/uploads/filename.ext>.

---

## **7. Route Flow Summary**

```bash
/api/users
├─ GET    /           → get all users (admin)
├─ GET    /:id        → get single user
├─ PUT    /:id        → update user (self/admin)
├─ DELETE /:id        → delete user and their posts/comments (self/admin)
├─ POST   /:id/avatar → add/update user avatar image url     (self/admin)

/api/auth
├─ POST   /login      → login
├─ POST   /register   → register
├─ POST   /logout     → logout

/api/posts
├─ POST   /           → create post (logged-in)
├─ GET    /           → get all posts
├─ GET    /:id        → get single post
├─ PUT    /:id        → update post (owner/admin)
├─ DELETE /:id        → soft delete post (owner/admin)
├─ POST   /:id/reactions   → add/update reaction
├─ DELETE /:id/reactions   → remove current user’s reaction

/api/comments
├─ POST   /           → create comment
├─ GET    /:postId    → get comments for post
├─ PUT    /:id        → update comment (owner/admin)
├─ DELETE /:id        → delete comment (owner/admin)

/api/jobs
├─ POST   /           → create job (admin)
├─ GET    /           → get all jobs
├─ GET    /:id        → get single job
├─ PUT    /:id        → update job (admin)
├─ DELETE /:id        → delete job (admin)

/api/breakrooms
├─ POST   /           → create breakroom (admin)
├─ GET    /           → get all breakrooms
├─ GET    /:id        → get single breakroom
├─ POST   /:id/join   → join breakroom
├─ POST   /:id/leave  → leave breakroom
```

![API Routes Overview](./api_routes.png)

## Project Structure

- Structure of How Project File System is Set Up

```bash
thebreakroom-main/
├── client/               # Frontend (React with Vite)
  ├── public/
    ├── assets/           # Project asset files
  ├── src/
    ├── components/       # Application components
    ├── contexts/         # Context files for state management
    ├── hooks/            # Custom hook files
    ├── App.css           # CSS file for main app component
    ├── App.jsx           # Main application component
    ├── index.css         # Global index css file
    ├── main.jsx          # Main component that encompasses the app component
  ├── index.html          # HTML file that holds the App component
  ├── package.json        # File that includes necessary packages to install for application
  ├── README.md           # README for client portion of the application
  ├── vite.config.js      # Configuration for using Vite in application
├── server/               # Backend (Node.js + Express)
  ├── config/             # Configuration files
    ├── passport/         # Files for passport configuration
    ├── db.js             # Configuration file for database
  ├── controllers/        # Folder that contains all controller files for application
  ├── email/              # Configuration files for email functionality
  ├── middleware/         # Files that contain middleware functions
  ├── models/             # Folder that contains files for different models for database functionality
  ├── routes/             # Folder that contains files for routes for regarding different components
  ├── services/           # Folder that contains files for different services that the app uses
  ├── uploads/            # Folder that contains profile images for user accounts
  ├── utils/              # Folder that contains files for different utility functions
  ├── README.md           # README for server portion of application
├── .gitignore            # File that contains extensions to ignore when committing to Github
├── logo.png              # Application logo
├── package.json          # File that includes necessary packages to install for application
└── README.md             # Project documentation
```

## Deployment

1. The application is deployed on Render.
   - Configure the environment variables on Render to match your `.env` file.

---

## Notes for Frontend Integration

1. Use `?withReactions=true` when fetching posts to include detailed reactions.
2. Reactions are nested under posts, no separate reaction routes are required.
3. Comments are fetched per post via `/api/comments/:postId`.
4. Soft deletion is used for posts; deleted posts have `isDeleted=true`.
5. Only owners or admins can update/delete posts, comments, or users.
6. Admin users can access all users; regular users can only update their own info.
7. Use JWT tokens in headers for all private routes:
   Authorization: Bearer {token}
8. Posts support withReactions=true query to fetch reaction details.
9. Soft delete means deleted posts have isDeleted=true but still exist in DB.
10. Admin users can access all users and delete posts/comments.
11. Reactions are one per user per post (upserted).
12. Breakrooms allow multiple memberships per user (users can join more than one).
13. Jobs link users with their profession and can be tied to Breakrooms for auto-suggestions.

---

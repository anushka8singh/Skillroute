# SkillRoute — Learning Path & Progress Tracker

SkillRoute is a full-stack web application that helps users create structured learning paths for any topic and track their progress step-by-step. Users can generate personalized learning paths, manage multiple learning plans, and mark completed steps as they progress through their learning journey.

The application is built using the MERN stack and includes authentication, user-specific dashboards, learning path generation, and progress tracking.

---

## Features

### User Authentication

* User signup and login
* JWT-based authentication
* Protected routes
* User-specific data storage

### Learning Path Generation

* Users enter a learning goal
* The system generates a structured step-by-step learning path
* Learning paths are stored in MongoDB
* Each learning path is displayed as a checklist

### Progress Tracking

* Steps displayed with checkboxes
* Users can mark steps as completed
* Progress is tracked per learning path
* Progress bar shows completion status

### Dashboard

* Sidebar with previous learning paths
* Main dashboard to create new learning paths
* Profile section with nickname
* Delete learning path option

### UI / UX

* Modern dashboard layout
* Sidebar navigation
* Progress bars
* Landing page with hero section
* Login and Signup pages
* White and purple theme

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt (password hashing)
* OpenAI API

### Database

* MongoDB Atlas

---

## Project Architecture

### System Architecture Flow

```
Frontend (React)
        ↓
Axios API Requests
        ↓
Express Backend (Node.js)
        ↓
Controllers
        ↓
MongoDB Database
```

### Authentication Flow

```
User Signup/Login
        ↓
Password hashed using bcrypt
        ↓
JWT token generated
        ↓
Token stored in localStorage
        ↓
Token sent in Authorization header
        ↓
Backend middleware verifies token
        ↓
Protected routes accessed
```

### Learning Path Flow

```
User enters learning goal
        ↓
Backend generates learning steps
        ↓
Learning path saved in MongoDB
        ↓
Frontend fetches learning paths
        ↓
Displayed as checklist
        ↓
User marks steps complete
        ↓
Progress updated in database
```

---

## Folder Structure

```
skillroute/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── README.md
└── .gitignore
```

---

## API Endpoints

### Authentication

```
POST /api/auth/signup
POST /api/auth/login
PATCH /api/auth/nickname
```

### Learning Paths

```
POST   /api/path
GET    /api/path
PATCH  /api/step/:pathId/:stepIndex
DELETE /api/path/:id
```

---

## Installation & Setup

### Backend Setup

```
cd backend
npm install
npm run dev
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```


## Future Improvements

* Add deadlines for steps
* Add notes per step
* Add recommended projects
* Add progress analytics
* Add collaborative learning paths
* Deploy application



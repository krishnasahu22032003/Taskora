# Taskora - Backend

This folder contains the **backend** of Taskora, a full-stack task management application. Built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**, the backend provides secure APIs, user authentication, and robust task management functionalities.

---

## Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Folder Structure](#folder-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Contact](#contact)  

---

## Features

- User registration and login with JWT-based authentication  
- Secure password hashing using bcrypt  
- Create, edit, delete, and fetch tasks  
- Filter and sort tasks  
- Middleware for authentication and error handling  
- TypeScript for type safety and maintainability  
- MongoDB and Mongoose for data storage and modeling  
- Configurable environment variables  

---

## Technologies Used

- **Node.js** - Server runtime  
- **Express.js** - Web framework for REST APIs  
- **TypeScript** - Strongly typed JavaScript for better reliability  
- **MongoDB** - NoSQL database  
- **Mongoose** - MongoDB object modeling  
- **JSON Web Token (JWT)** - Authentication  
- **bcrypt** - Password hashing  
- **dotenv** - Environment variable management  

---

## Folder Structure

```plaintext
backend/
├── src/
│   ├── config/       # Database connection and environment configuration
│   ├── controllers/  # Request handlers and business logic
│   ├── middleware/   # Authentication, error handling, and custom middleware
│   ├── routes/       # Express routes
│   ├── types/        # TypeScript type definitions
│   ├── models/       # Mongoose schemas and models
│   └── server.ts     # Entry point for the backend server
├── package.json       # Backend dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # Backend documentation
```
# Installation

1. Navigate to the backend folder:

cd backend

2. Install dependencies:

npm install

3. Create a .env file with the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


4. Start the backend server:

npm run dev

The server will start on the port defined in your .env file (default 5000).


# Usage

Register a new user or log in to your existing account
Use the available APIs to create, edit, delete, and fetch tasks
Ensure JWT token is sent with requests to protected routes
Utilize sorting and filtering features for task management

# API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/user/signup	Register a new user
POST	/api/user/signin	Login and receive JWT token
GET	/api/Task	Fetch all tasks for a user
POST	/api/Task	Create a new task
PUT	/api/Task/:id	Update a task by ID
DELETE	/api/Task/:id	Delete a task by ID

All task endpoints require authentication via JWT.

# Contact

For any queries or suggestions, reach out to:
Krishna Sahu
📧 Email: krishna.sahu.work@gmail.com

Taskora Backend – A secure, scalable, and type-safe backend powering the full-stack task management application.
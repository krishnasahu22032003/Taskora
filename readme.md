# Taskora 🚀

![Taskora Screenshots](./Screenshots/Taskora%20screenshot.png)  
*Experience Taskora – a sleek, modern full-stack task management application.*

Taskora is a full-stack task management application designed to help users efficiently manage, track, and complete their daily tasks. With a responsive, modern interface and a robust backend, Taskora offers a seamless, secure, and productive task management experience.

---
## Frontend
See [Frontend/README.md](FRONTEND/README.md) for setup instructions and details.

## Backend
See [Backend/readme.md](Backend/readme.md) for setup instructions and details.

## 🔖 Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Folder Structure](#folder-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Screenshots](#screenshots)  
- [Contact](#contact)  
- [License](#license)  

---

## ✨ Features

- Create, edit, and delete tasks  
- Mark tasks as **completed** or **pending**  
- Filter and sort tasks by date, status, or priority  
- Secure user authentication and authorization with **JWT**  
- Fully responsive frontend built with **React** and **Tailwind CSS**  
- Easy navigation using **React Router DOM**  
- Interactive UI icons via **Lucide Icons**  
- Notifications for actions using **React Toastify**  
- Backend API with **Express** and **MongoDB** for robust data management  

---

## 🛠 Technologies Used

**Frontend:**  
- React  
- Tailwind CSS  
- React Router DOM  
- Lucide Icons  
- React Toastify  
- Axios  
- Date-fns  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- JSON Web Token (JWT)  
- bcrypt (password hashing)  

---

## 📂 Folder Structure

## Folder Structure

Taskora/
├── backend/ # Backend code (Express API, MongoDB models)
├── frontend/ # Frontend code (React, Tailwind, Components)
├── screenshots/ # Screenshots of the application
└── README.md # Project documentation

## Installation

### Backend

1. Navigate to the `backend` folder:

```bash
cd backend

2. Install dependencies:

npm install

3.Create a .env file in the backend folder with the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4. Start the backend server:

npm run dev

# Frontend

1. Navigate to the frontend folder:
cd frontend

2.Install dependencies:

npm install


3.Start the frontend server:

npm run dev

4.Open your browser and go to http://localhost:5173 (or the URL provided in terminal)

## Usage

Register or login to your account

Create new tasks and categorize them as pending or completed
Edit or delete tasks as needed
Track task completion progress
Explore filtering and sorting features

## Screenshots

You can view all screenshots in the screenshots folder.
Here are a few key examples:

## Contact

For any queries or suggestions, you can reach me at:
Krishna Sahu
📧 Email: krishna.sahu.work@gmail.com

## License

This project is open-source and available for personal or educational purposes.

Taskora – A modern, full-stack task management application built to simplify productivity and workflow management.
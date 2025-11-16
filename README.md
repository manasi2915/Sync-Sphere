Sync-Sphere

A full-stack collaboration platform designed for seamless communication, task management, and user productivity. Built using **React.js**, **Node.js**, **Express.js**, and **MongoDB**, Sync‑Sphere provides a smooth and efficient workspace for teams.

 Features

Authentication

* User Registration
* Secure Login (JWT Authentication)
* Password Encryption (bcrypt)
* Token-based Authorization

User Profile Management

* Update profile details
* Manage personal information
* Profile image upload (Cloud / Local depending on your setup)

Project / Workspace Features

* Create new projects
* View existing projects
* Add or remove tasks (if implemented)
* Collaborative workflows

Messaging / Communication

* Real-time chat or basic messaging
* Stores chat messages in database

File Management

* Upload & store files in project or user-specific folders
* MongoDB reference storage

Admin-side Functionalities

* View all users
* Delete or edit specific user details
* Basic analytics or logs



Tech Stack

Frontend

* React.js (Vite or CRA)
* React Router
* Axios for API communication
* TailwindCSS / CSS Modules

Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* Multer (for file uploads)
* JWT Authentication
* bcrypt

Other Tools

* Postman (API testing)
* Git & GitHub
* VS Code


Folder Structure


Sync-Sphere/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    └── package.json


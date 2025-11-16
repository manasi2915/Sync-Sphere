SyncSphere is a full-stack MERN application designed to help students track expenses, plan study sessions, join events, manage resources, and stay productive.
It includes authentication, dashboards, interactive tools, and real-time student utilities.

Features
-> Authentication
Login & registration with JWT
Student/Admin roles
Protected API routes
LocalStorage-based session handling

-> Events Module

View upcoming events
Join events
Admins can create and manage events

-> Resources Module

Students can access uploaded study materials
Admins can upload PDFs and files
File storage with Multer

-> Study Planner

Pomodoro Timer (25-minute sessions)
Recent sessions list
Leaderboard system
Streak tracking
Study metrics

-> Expense Tracker

Add expenses
Split expenses between friends
Auto-calc “you owe” / “owed to you”
Category-based pie chart
MongoDB-based persistent storage

-> Profile

View user information
(Optional) Update profile

-> Tech Stack
Frontend
React.js
TailwindCSS
Chart.js
React Router
Fetch API (custom wrapper)

Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Auth
Multer for uploads
Database

MongoDB (Local or MongoDB Atlas)

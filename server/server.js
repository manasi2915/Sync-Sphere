require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Message = require('./models/Message');   // ✅ NEW

// ROUTES
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const resourceRoutes = require('./routes/resources');
const studyRoutes = require('./routes/study');
const expenseRoutes = require('./routes/expenses');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');
const chatRoutes = require('./routes/chat');     // ✅ NEW

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json());

// uploads folder
app.use(
  '/' + (process.env.UPLOAD_DIR || 'uploads'),
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads'))
);

// ------------------ ROUTES ------------------
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/api/chat', chatRoutes);  // ✅ CHAT API ENABLED

// test endpoint
app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

// ------------------ SOCKET.IO ------------------
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("message", async (payload) => {
    const { room, senderId, text } = payload;

    // Save to MongoDB
    const Message = require("./models/Message");
    const saved = await Message.create({
      room,
      sender: senderId,
      text
    });

    // Emit to room
    io.to(room).emit("message", {
      room,
      senderId,
      text,
      createdAt: saved.createdAt
    });
  });
});

// ------------------ DATABASE + DEFAULT USERS ------------------

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/syncsphere')
  .then(async () => {
    console.log("Connected to MongoDB");

    // ---------------- CREATE DEFAULT ADMIN ----------------
    try {
      const adminEmail = "admin@example.com";
      const existingAdmin = await User.findOne({ email: adminEmail });

      if (!existingAdmin) {
        await User.create({
          name: "Administrator",
          email: adminEmail,
          password: await bcrypt.hash("admin123", 10),
          role: "admin"
        });
        console.log("✅ Default admin created (admin@example.com / admin123)");
      } else {
        console.log("ℹ️ Default admin exists:", adminEmail);
      }
    } catch (err) {
      console.error("Admin creation error:", err);
    }

    // ---------------- CREATE DEFAULT STUDENTS ----------------
    async function createStudents() {
      const students = [
        { name: "Alice", email: "alice@student.com", password: "123456", role: "student" },
        { name: "Bob", email: "bob@student.com", password: "123456", role: "student" }
      ];

      for (const s of students) {
        const exists = await User.findOne({ email: s.email });
        if (!exists) {
          await User.create({
            name: s.name,
            email: s.email,
            password: await bcrypt.hash(s.password, 10),
            role: s.role
          });
          console.log("Created default student:", s.email);
        } else {
          console.log("Student exists:", s.email);
        }
      }
    }
    createStudents();

    // ---------------- START SERVER ----------------
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));

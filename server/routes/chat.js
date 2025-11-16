const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get chat users
router.get("/users", async (req, res) => {
  try {
    const allowed = ["admin@example.com", "alice@student.com", "bob@student.com"];
    const users = await User.find({ email: { $in: allowed } }, "name email role");
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// GET messages for a room
router.get("/messages/:room", auth, async (req, res) => {
  try {
    const msgs = await Message.find({ room: req.params.room })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(msgs);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// SAVE message
router.post("/messages", auth, async (req, res) => {
  try {
    const msg = await Message.create({
      room: req.body.room,
      sender: req.user.id,
      text: req.body.text
    });

    res.json(msg);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;

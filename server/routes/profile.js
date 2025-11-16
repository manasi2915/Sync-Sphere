const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// get
router.get('/', auth, async (req,res)=>{
  const u = await User.findById(req.user.id).select('-password');
  res.json(u);
});

// update
router.put('/', auth, async (req,res)=>{
  const updates = req.body;
  const u = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json(u);
});

module.exports = router;

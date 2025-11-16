const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Example protected admin dashboard route
router.get('/dashboard', auth, admin, (req, res) => {
  res.json({ msg: "Admin dashboard access granted" });
});

module.exports = router;

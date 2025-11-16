const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const Expense = require('../models/Expense');
const User = require('../models/User');

const upload = multer({ dest: process.env.UPLOAD_DIR || 'uploads/' });

// create expense and auto-split evenly if requested
router.post('/', auth, upload.array('receipts', 5), async (req,res)=>{
  try {
    const { title, amount, splitEven, splitUsers } = req.body;
    const receipts = (req.files || []).map(f => '/' + (process.env.UPLOAD_DIR || 'uploads') + '/' + f.filename);
    let splits = [];
    if(splitEven === 'true' || splitEven === true){
      const users = splitUsers ? JSON.parse(splitUsers) : [req.user.id];
      const share = parseFloat(amount) / users.length;
      splits = users.map(u => ({ user: u, share }));
    } else if(splitUsers){
      splits = JSON.parse(splitUsers);
    }
    const e = new Expense({ title, amount, paidBy: req.user.id, splits, receipts });
    await e.save();
    res.json(e);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// list for user
router.get('/', auth, async (req,res)=>{
  const list = await Expense.find({ $or: [ { paidBy: req.user.id }, { 'splits.user': req.user.id } ] })
    .populate('paidBy','name email').populate('splits.user','name email');
  res.json(list);
});

// summary analytics
router.get('/summary', auth, async (req,res)=>{
  const byUser = await Expense.aggregate([
    { $unwind: "$splits" },
    { $group: { _id: "$splits.user", totalOwed: { $sum: "$splits.share" } } }
  ]);
  res.json({ byUser });
});

module.exports = router;

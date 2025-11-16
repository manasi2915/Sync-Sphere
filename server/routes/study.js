const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Study = require('../models/StudySession');

// create
router.post('/', auth, async (req,res)=>{
  try {
    const s = new Study({ ...req.body, participants: [req.user.id] });
    await s.save();
    res.json(s);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// join
router.post('/:id/join', auth, async (req,res)=>{
  const s = await Study.findById(req.params.id);
  if(!s) return res.status(404).json({ msg: 'Not found' });
  if(s.participants.includes(req.user.id)) return res.status(400).json({ msg: 'Already joined' });
  if(s.maxParticipants && s.participants.length >= s.maxParticipants) return res.status(400).json({ msg: 'Full' });
  s.participants.push(req.user.id);
  await s.save();
  res.json(s);
});

// list
router.get('/', async (req,res)=>{
  const list = await Study.find().populate('participants','name email');
  res.json(list);
});

module.exports = router;

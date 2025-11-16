const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

// create event
router.post('/', auth, async (req,res)=>{
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id });
    await event.save();
    res.json(event);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// list with pagination & search (q, tag)
router.get('/', async (req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit)||20, 100);
    const q = req.query.q;
    const filter = {};
    if(q) filter.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }, { tags: new RegExp(q,'i') }];
    const events = await Event.find(filter).sort({date:1}).skip((page-1)*limit).limit(limit);
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page, pages: Math.ceil(total/limit) });
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// attend event
router.post('/:id/attend', auth, async (req,res)=>{
  try {
    const ev = await Event.findById(req.params.id);
    if(!ev) return res.status(404).json({ msg: 'Event not found' });
    if(ev.capacity && ev.attendees.length >= ev.capacity) return res.status(400).json({ msg: 'Event full' });
    if(ev.attendees.includes(req.user.id)) return res.status(400).json({ msg: 'Already joined' });
    ev.attendees.push(req.user.id);
    await ev.save();
    res.json(ev);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// event analytics: attendees count
router.get('/:id/stats', auth, async (req,res)=>{
  try {
    const ev = await Event.findById(req.params.id).populate('attendees','name email');
    if(!ev) return res.status(404).json({ msg: 'Event not found' });
    res.json({ attendeeCount: ev.attendees.length, attendees: ev.attendees });
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;

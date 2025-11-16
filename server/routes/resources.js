const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const Resource = require('../models/Resource');

const upload = multer({ dest: process.env.UPLOAD_DIR || 'uploads/' });

// create resource with optional images
router.post('/', auth, upload.array('images', 5), async (req,res)=>{
  try {
    const images = (req.files || []).map(f => '/' + (process.env.UPLOAD_DIR || 'uploads') + '/' + f.filename);
    const resource = new Resource({ ...req.body, owner: req.user.id, images });
    await resource.save();
    res.json(resource);
  } catch(err){ console.error(err); res.status(500).send('Server error'); }
});

// list & search
router.get('/', async (req,res)=>{
  const q = req.query.q;
  const filter = {};
  if(q) filter.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }, { category: new RegExp(q,'i') }];
  const list = await Resource.find(filter).sort({createdAt:-1}).limit(100);
  res.json(list);
});

// toggle availability
router.post('/:id/toggle', auth, async (req,res)=>{
  const r = await Resource.findById(req.params.id);
  if(!r) return res.status(404).json({ msg: 'Not found' });
  if(r.owner.toString() !== req.user.id) return res.status(403).json({ msg: 'Not owner' });
  r.available = !r.available;
  await r.save();
  res.json(r);
});

// swap request (simple record via comments field)
router.post('/:id/swap', auth, async (req,res)=>{
  const r = await Resource.findById(req.params.id);
  if(!r) return res.status(404).json({ msg: 'Not found' });
  // In real app you'd create a swap collection; here we just reply
  res.json({ msg: 'Swap request recorded (mock)', resource: r });
});

module.exports = router;

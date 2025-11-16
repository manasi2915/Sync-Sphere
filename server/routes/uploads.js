const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: process.env.UPLOAD_DIR || 'uploads/' });

router.post('/file', upload.single('file'), (req,res)=>{
  if(!req.file) return res.status(400).json({ msg: 'No file' });
  res.json({ path: '/' + (process.env.UPLOAD_DIR || 'uploads') + '/' + req.file.filename, originalname: req.file.originalname });
});

module.exports = router;

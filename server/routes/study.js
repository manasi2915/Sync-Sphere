// server/routes/study.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Study = require('../models/StudySession');

// -------------------------
// Helper: calculate streak
// -------------------------
function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;

  // sort descending (latest first)
  dates.sort((a, b) => b - a);

  let streak = 1;
  let current = new Date(dates[0]);

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i]);
    const diffDays = (current - prev) / (1000 * 60 * 60 * 24);

    // if previous study day is yesterday or same day, continue streak
    if (diffDays <= 1.01) {
      streak++;
      current = prev;
    } else {
      break;
    }
  }

  return streak;
}

// -------------------------
// CREATE STUDY SESSION
// POST /api/study
// body: { title, subject, duration, maxParticipants }
// -------------------------
router.post('/', auth, async (req, res) => {
  try {
    const { title, subject, duration, maxParticipants } = req.body;

    const s = new Study({
      title,
      subject,
      duration: duration || 60,
      maxParticipants,
      participants: [req.user.id],     // creator automatically joins
      completedAt: new Date(),
    });

    await s.save();
    res.json(s);
  } catch (err) {
    console.error('Study create error', err);
    res.status(500).send('Server error');
  }
});

// -------------------------
// JOIN SESSION
// POST /api/study/:id/join
// -------------------------
router.post('/:id/join', auth, async (req, res) => {
  try {
    const s = await Study.findById(req.params.id);
    if (!s) return res.status(404).json({ msg: 'Not found' });

    const userId = String(req.user.id);
    const already = s.participants.some(p => String(p) === userId);
    if (already) return res.status(400).json({ msg: 'Already joined' });

    if (s.maxParticipants && s.participants.length >= s.maxParticipants) {
      return res.status(400).json({ msg: 'Full' });
    }

    s.participants.push(req.user.id);
    await s.save();
    res.json(s);
  } catch (err) {
    console.error('Study join error', err);
    res.status(500).send('Server error');
  }
});

// -------------------------
// LIST SESSIONS
// GET /api/study
// -------------------------
router.get('/', async (req, res) => {
  try {
    const list = await Study.find()
      .sort({ createdAt: -1 })
      .populate('participants', 'name email');
    res.json(list);
  } catch (err) {
    console.error('Study list error', err);
    res.status(500).send('Server error');
  }
});

// -------------------------
// STREAK + RANK
// GET /api/study/stats   (auth)
// -------------------------
router.get('/stats', auth, async (req, res) => {
  try {
    const all = await Study.find().lean();

    // totals[ userId ] = totalMinutes
    const totals = {};
    // datesByUser[ userId ] = [Date, Date, ...]
    const datesByUser = {};

    for (const s of all) {
      const duration = s.duration || 0;
      const when = s.completedAt || s.createdAt || new Date();

      for (const p of s.participants || []) {
        const uid = String(p);

        totals[uid] = (totals[uid] || 0) + duration;

        if (!datesByUser[uid]) datesByUser[uid] = [];
        datesByUser[uid].push(new Date(when));
      }
    }

    const rows = Object.keys(totals).map(userId => ({
      userId,
      total: totals[userId],
      streak: calculateStreak(datesByUser[userId] || []),
    }));

    // order by total minutes desc
    rows.sort((a, b) => b.total - a.total);

    const myId = String(req.user.id);
    const myRow = rows.find(r => r.userId === myId);
    const myRank = myRow ? rows.findIndex(r => r.userId === myId) + 1 : null;

    res.json({
      streak: myRow ? myRow.streak : 0,
      rank: myRank,
    });
  } catch (err) {
    console.error('Study stats error', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

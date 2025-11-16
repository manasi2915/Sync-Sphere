/**
 * Seed: creates admin, sample users, events, resources, study sessions, and expenses.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Resource = require('./models/Resource');
const Study = require('./models/StudySession');
const Expense = require('./models/Expense');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/syncsphere';
mongoose.connect(MONGO).then(async ()=> {
  await User.deleteMany({});
  await Event.deleteMany({});
  await Resource.deleteMany({});
  await Study.deleteMany({});
  await Expense.deleteMany({});

  const admin = new User({ name: 'Admin', email: 'admin@sync.com', password: await bcrypt.hash('password',10), role: 'admin' });
  await admin.save();
  const u1 = new User({ name: 'Alice', email: 'alice@sync.com', password: await bcrypt.hash('password',10) });
  const u2 = new User({ name: 'Bob', email: 'bob@sync.com', password: await bcrypt.hash('password',10) });
  await u1.save(); await u2.save();

  await new Event({ title: 'Orientation', description: 'Welcome', date: new Date(), venue: 'Auditorium', createdBy: admin._id }).save();
  await new Event({ title: 'Hackathon', description: '24h hack', date: new Date(Date.now() + 7*24*3600*1000), venue: 'Lab 1', tags: ['tech','hack'] , createdBy: u1._id }).save();

  await new Resource({ title: 'Calculus Book', description: 'Used', owner: u1._id }).save();
  await new Resource({ title: 'Guitar', description: 'Acoustic', owner: u2._id }).save();

  await new Study({ topic: 'DSA Study Group', startTime: new Date(), pomodoroMinutes: 25, participants: [u1._id, u2._id] }).save();

  await new Expense({ title: 'Project materials', amount: 1200, paidBy: u1._id, splits: [{ user: u1._id, share: 600 }, { user: u2._id, share: 600 }] }).save();

  console.log('Seed complete'); process.exit(0);
}).catch(err=>{ console.error(err); process.exit(1); });

const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },

  // NEW FIELD (your choice A)
  category: { type: String, default: "Others" },

  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  splits: [
    { 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
      share: Number 
    }
  ],

  receipts: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);

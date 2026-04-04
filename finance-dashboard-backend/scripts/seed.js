/**
 * Seed Script — Realistic Financial Transactions
 * Usage: node scripts/seed.js
 *
 * Requires: npm install mongoose dotenv (already available in project)
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-dashboard';

// ── Minimal Schemas ─────────────────────────────────────────────
const UserSchema = new mongoose.Schema({ email: String, role: String }, { collection: 'users' });
const TransactionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:    { type: Number, required: true },
  type:      { type: String, enum: ['income', 'expense'], required: true },
  category:  { type: String, required: true },
  date:      { type: Date, required: true },
  notes:     { type: String },
  isDeleted: { type: Boolean, default: false },
}, { collection: 'transactions', timestamps: true });

const User        = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// ── Helpers ─────────────────────────────────────────────────────
function daysAgo(d) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(Math.floor(Math.random() * 10) + 8, Math.floor(Math.random() * 59), 0, 0);
  return date;
}

function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// ── Seed Data ───────────────────────────────────────────────────
function buildTransactions(userId) {
  return [
    // ── MONTH 6 (oldest) ──
    { amount: 85000,  type: 'income',  category: 'Salary',        date: daysAgo(172), notes: 'Monthly salary credit — October payroll' },
    { amount: 18000,  type: 'expense', category: 'Rent',          date: daysAgo(170), notes: 'October house rent payment' },
    { amount: 3200,   type: 'expense', category: 'Utilities',     date: daysAgo(168), notes: 'Electricity & internet bill' },
    { amount: rand(800, 1800),  type: 'expense', category: 'Food', date: daysAgo(165), notes: 'Weekly groceries' },
    { amount: 12000,  type: 'income',  category: 'Freelance',     date: daysAgo(162), notes: 'UI design project — client payment' },
    { amount: rand(600, 2500),  type: 'expense', category: 'Travel', date: daysAgo(160), notes: 'Cab rides & auto fares' },

    // ── MONTH 5 ──
    { amount: 85000,  type: 'income',  category: 'Salary',        date: daysAgo(142), notes: 'Monthly salary credit — November payroll' },
    { amount: 18000,  type: 'expense', category: 'Rent',          date: daysAgo(140), notes: 'November house rent payment' },
    { amount: 2800,   type: 'expense', category: 'Utilities',     date: daysAgo(138), notes: 'Water & gas bill' },
    { amount: rand(800, 1500), type: 'expense', category: 'Food', date: daysAgo(135), notes: 'Restaurant + grocery run' },
    { amount: 5500,   type: 'expense', category: 'Shopping',      date: daysAgo(132), notes: 'Clothing & accessories — sale' },
    { amount: 20000,  type: 'income',  category: 'Freelance',     date: daysAgo(130), notes: 'Full-stack feature build — client B' },
    { amount: 3800,   type: 'expense', category: 'Entertainment', date: daysAgo(128), notes: 'OTT subscriptions + movie outing' },

    // ── MONTH 4 ──
    { amount: 85000,  type: 'income',  category: 'Salary',        date: daysAgo(112), notes: 'Monthly salary credit — December payroll' },
    { amount: 18000,  type: 'expense', category: 'Rent',          date: daysAgo(110), notes: 'December house rent payment' },
    { amount: rand(1200, 3500), type: 'expense', category: 'Travel', date: daysAgo(107), notes: 'Holiday trip — train & hotel' },
    { amount: 15000,  type: 'income',  category: 'Investment',    date: daysAgo(105), notes: 'Mutual fund redemption — ELSS' },
    { amount: rand(500, 1200), type: 'expense', category: 'Food', date: daysAgo(103), notes: 'Holiday dining & takeaway' },
    { amount: 7200,   type: 'expense', category: 'Shopping',      date: daysAgo(100), notes: 'Festive gifts — December shopping' },
    { amount: 2500,   type: 'expense', category: 'Healthcare',    date: daysAgo(98),  notes: 'Doctor visit & medicines' },

    // ── MONTH 3 ──
    { amount: 85000,  type: 'income',  category: 'Salary',        date: daysAgo(82),  notes: 'Monthly salary credit — January payroll' },
    { amount: 18000,  type: 'expense', category: 'Rent',          date: daysAgo(80),  notes: 'January house rent payment' },
    { amount: 3100,   type: 'expense', category: 'Utilities',     date: daysAgo(77),  notes: 'Electricity & broadband bill' },
    { amount: 25000,  type: 'income',  category: 'Freelance',     date: daysAgo(74),  notes: 'Mobile app build — startup client' },
    { amount: rand(900, 1600), type: 'expense', category: 'Food', date: daysAgo(72),  notes: 'Groceries + team lunch outing' },
    { amount: 4200,   type: 'expense', category: 'Entertainment', date: daysAgo(69),  notes: 'Weekend events + streaming' },

    // ── MONTH 2 ──
    { amount: 85000,  type: 'income',  category: 'Salary',        date: daysAgo(52),  notes: 'Monthly salary credit — February payroll' },
    { amount: 18000,  type: 'expense', category: 'Rent',          date: daysAgo(50),  notes: 'February house rent payment' },
    { amount: rand(1500, 4000), type: 'expense', category: 'Travel', date: daysAgo(47), notes: 'Weekend getaway — Airfare + hotel' },
    { amount: 10000,  type: 'income',  category: 'Investment',    date: daysAgo(45),  notes: 'Dividend payout — stock portfolio' },
    { amount: rand(600, 1400), type: 'expense', category: 'Food', date: daysAgo(43),  notes: 'Monthly grocery stock-up' },
    { amount: 3500,   type: 'expense', category: 'Healthcare',    date: daysAgo(40),  notes: 'Annual health checkup + lab tests' },
    { amount: 6000,   type: 'expense', category: 'Shopping',      date: daysAgo(38),  notes: 'Electronics — earphones & accessories' },

    // ── MONTH 1 (most recent) ──
    { amount: 85000,  type: 'income',  category: 'Salary',        date: daysAgo(22),  notes: 'Monthly salary credit — March payroll' },
    { amount: 18000,  type: 'expense', category: 'Rent',          date: daysAgo(20),  notes: 'March house rent payment' },
    { amount: 2900,   type: 'expense', category: 'Utilities',     date: daysAgo(18),  notes: 'Electricity, internet & water bill' },
    { amount: 18000,  type: 'income',  category: 'Freelance',     date: daysAgo(15),  notes: 'Dashboard design — fintech client' },
    { amount: rand(800, 1800), type: 'expense', category: 'Food', date: daysAgo(12),  notes: 'Groceries + restaurant dining' },
    { amount: rand(1000, 3000), type: 'expense', category: 'Travel', date: daysAgo(8), notes: 'Business travel — cab & metro' },
    { amount: 8000,   type: 'income',  category: 'Investment',    date: daysAgo(5),   notes: 'SIP returns — index fund' },
    { amount: 2200,   type: 'expense', category: 'Entertainment', date: daysAgo(3),   notes: 'Concert tickets + streaming plan' },
  ].map(tx => ({ ...tx, userId, isDeleted: false }));
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱  Finance Dashboard — Seed Script');
  console.log('   Connecting to:', MONGODB_URI, '\n');

  await mongoose.connect(MONGODB_URI);

  // Find the first admin user (or any user)
  const user = await User.findOne({ role: 'admin' }) || await User.findOne();

  if (!user) {
    console.error('❌  No user found in DB. Please register an account first, then re-run this script.');
    process.exit(1);
  }

  console.log(`✅  Using account: ${user.email} (${user.role})`);

  // Clear existing transactions (optional — comment out to keep old data)
  const deleteResult = await Transaction.deleteMany({});
  console.log(`🗑   Cleared ${deleteResult.deletedCount} existing transaction(s).`);

  // Insert seed data
  const txData = buildTransactions(user._id);
  await Transaction.insertMany(txData);

  console.log(`\n✅  Seeded ${txData.length} transactions successfully!\n`);
  console.log('   📊  Income entries: ', txData.filter(t => t.type === 'income').length);
  console.log('   📉  Expense entries:', txData.filter(t => t.type === 'expense').length);
  console.log('\n   Refresh your dashboard to see the charts update.\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});

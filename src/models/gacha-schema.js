const mongoose = require('mongoose');

const prizesSchema = new mongoose.Schema({
  name: String,
  quota: Number,
  chance: Number,
  winners_count: {
    type: Number,
    default: 0,
  },
});

const gachaLogSchema = new mongoose.Schema({
  user_id: String,
  user_name: String,
  prize_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prizes',
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = () => {
  const Prizes = mongoose.model('Prizes', prizesSchema);
  const GachaLogs = mongoose.model('GachaLogs', gachaLogSchema);
  return { Prizes, GachaLogs };
};

const mongoose = require('mongoose');

const Prizes = mongoose.model('Prizes');
const GachaLogs = mongoose.model('GachaLogs');

async function getAvailablePrizes() {
  return Prizes.find({ $expr: { $gt: ['$quota', '$winners_count'] } });
}

async function incrementWinner(prizeId) {
  return Prizes.updateOne({ _id: prizeId }, { $inc: { winners_count: 1 } });
}

async function createLog(data) {
  const log = await GachaLogs.create(data);
  return GachaLogs.findById(log._id).populate('prize_id');
}

async function getDailyCount(userId, startOfDay) {
  return GachaLogs.countDocuments({
    user_id: userId,
    created_at: { $gte: startOfDay },
  });
}

async function getHistory(userId) {
  return GachaLogs.find({ user_id: userId }).populate('prize_id');
}

async function getAllPrizes() {
  return Prizes.find({});
}

async function getWinners() {
  return GachaLogs.find({ prize_id: { $ne: null } }).populate('prize_id');
}

async function createPrize(name, quota, chance) {
  return Prizes.create({ name, quota, chance, winners_count: 0 });
}

module.exports = {
  getAvailablePrizes,
  incrementWinner,
  createLog,
  getDailyCount,
  getHistory,
  getAllPrizes,
  getWinners,
  createPrize,
};

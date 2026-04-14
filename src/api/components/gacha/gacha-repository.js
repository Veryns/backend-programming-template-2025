const GachaLog = require('../../../models/gacha-schema');

class GachaRepository {
  async countUserGachaToday(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await GachaLog.countDocuments({
      userId,
      createdAt: { $gte: startOfDay },
    });
  }

  async countPrizeWinners(prizeName) {
    return await GachaLog.countDocuments({ prizeName });
  }

  async saveGachaResult(data) {
    return await GachaLog.create(data);
  }

  async getAllLogs() {
    return await GachaLog.find().sort({ createdAt: -1 });
  }

  async getWinners() {
    // Mengambil data yang prizeName-nya bukan null/Zonk
    return await GachaLog.find({ prizeName: { $ne: null } }).sort({
      createdAt: -1,
    });
  }

  async getUserHistory(userId) {
    // Mencari semua log gacha milik userId tertentu dan diurutkan dari yang terbaru
    return await GachaLog.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new GachaRepository();

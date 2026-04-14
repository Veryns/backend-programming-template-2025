const gachaRepository = require('./gacha-repository');

class GachaService {
  constructor() {
    this.prizes = [
      { name: 'Emas 10 gram', quota: 1 },
      { name: 'Smartphone X', quota: 5 },
      { name: 'Smartwatch Y', quota: 10 },
      { name: 'Voucher Rp100.000', quota: 100 },
      { name: 'Pulsa Rp50.000', quota: 500 },
    ];
  }

  async executeGacha(userId, userName) {
    // Cek kuota harian (Maks 5x)
    const dailyCount = await gachaRepository.countUserGachaToday(userId);
    if (dailyCount >= 5) {
      throw new Error(
        'Kesempatan gacha harian Anda udah habis bro (Maks 5x). Gas gacha lagi besok atau bikin user baru.'
      );
    }
    // Gacha dengan peluang acak
    const randomIndex = Math.floor(Math.random() * (this.prizes.length + 5));
    const selectedPrize = this.prizes[randomIndex];

    let wonPrize = null;

    if (selectedPrize) {
      const currentWinners = await gachaRepository.countPrizeWinners(
        selectedPrize.name
      );
      if (currentWinners < selectedPrize.quota) {
        wonPrize = selectedPrize.name;
      }
    }

    await gachaRepository.saveGachaResult({
      userId,
      userName,
      prizeName: wonPrize,
    });

    return wonPrize;
  }

  async getPrizeInventory() {
    const inventory = [];
    for (const prize of this.prizes) {
      const wonCount = await gachaRepository.countPrizeWinners(prize.name);
      inventory.push({
        Prize: prize.name,
        Sisa_prize: prize.quota - wonCount,
      });
    }
    return inventory;
  }

  async getAnonymizedWinners() {
    const winners = await gachaRepository.getWinners();
    return winners.map((w) => {
      const name = w.userName;
      const masked =
        name.length > 2
          ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
          : `${name[0]}*`;

      return {
        Nama: masked,
        Prize: w.prizeName,
        Tanggal: w.createdAt,
      };
    });
  }

  async getUserHistory(userId) {
    // Memanggil repository untuk mengambil data histori berdasarkan userId
    const history = await gachaRepository.getUserHistory(userId);

    if (!history || history.length === 0) {
      throw new Error(
        'Histori gacha ga ada di userId ini bro, coba cek lagi userId-nya.'
      );
    }

    return history;
  }
}

module.exports = new GachaService();

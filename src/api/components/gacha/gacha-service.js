const gachaRepository = require('./gacha-repository');

const PRIZE_LIST = [
  { name: 'Emas 10 gram', quota: 1, chance: 0.001 },
  { name: 'Smartphone X', quota: 5, chance: 0.005 },
  { name: 'Smartwatch Y', quota: 10, chance: 0.01 },
  { name: 'Voucher Rp100.000', quota: 100, chance: 0.1 },
  { name: 'Pulsa Rp50.000', quota: 500, chance: 0.5 },
];

async function syncPrizes() {
  try {
    const existingPrizes = await gachaRepository.getAllPrizes();
    if (existingPrizes.length === 0) {
      for (const p of PRIZE_LIST) {
        await gachaRepository.createPrize(p.name, p.quota, p.chance);
      }
    }
  } catch (error) {
    // Silent catch during startup
  }
}

syncPrizes();

async function rollGacha(userId, userName) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const dailyCount = await gachaRepository.getDailyCount(userId, startOfDay);
  if (dailyCount >= 5) {
    throw new Error('LIMIT_REACHED');
  }

  const prizes = await gachaRepository.getAvailablePrizes();
  let selectedPrize = null;
  const roll = Math.random();
  let cumulativeChance = 0;

  for (const prize of prizes) {
    cumulativeChance += prize.chance;
    if (roll < cumulativeChance) {
      selectedPrize = prize;
      break;
    }
  }

  if (selectedPrize) {
    await gachaRepository.incrementWinner(selectedPrize._id);
  }

  return gachaRepository.createLog({
    user_id: userId,
    user_name: userName,
    prize_id: selectedPrize ? selectedPrize._id : null,
  });
}

async function getUserHistory(userId) {
  return gachaRepository.getHistory(userId);
}

async function getPrizeQuotas() {
  return gachaRepository.getAllPrizes();
}

async function getWinners() {
  return gachaRepository.getWinners();
}

module.exports = {
  rollGacha,
  getUserHistory,
  getPrizeQuotas,
  getWinners,
};

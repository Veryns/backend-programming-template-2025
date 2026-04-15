const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

function maskName(name) {
  if (!name || name.length < 2) return '***';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

async function rollGacha(request, response, next) {
  try {
    const { user_id, user_name } = request.body;
    if (!user_id || !user_name) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'User ID dan Nama harus diisi.'
      );
    }

    const result = await gachaService.rollGacha(user_id, user_name);

    return response.status(200).json({
      message: result.prize_id
        ? 'Wihhhh kamu hokii!!'
        : 'Sorry, kamu belum hoki, gas gacha lagi.',
      details: {
        log_id: result._id,
        prize_name: result.prize_id ? result.prize_id.name : 'Zonk',
        prize_id: result.prize_id ? result.prize_id._id : null,
        created_at: result.created_at,
      },
    });
  } catch (error) {
    if (error.message === 'LIMIT_REACHED') {
      return response.status(403).json({
        statusCode: 403,
        error: 'Cuihh ada gambler.',
        message: 'Kesempatan gacha mu udah sampai limit (Maks 5 kali sehari)',
      });
    }
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const history = await gachaService.getUserHistory(request.params.userId);
    const formattedHistory = history.map((h) => ({
      id_log: h._id,
      nama_hadiah: h.prize_id ? h.prize_id.name : 'Tidak Menang',
      id_hadiah: h.prize_id ? h.prize_id._id : null,
      waktu: h.created_at,
    }));

    return response.status(200).json(formattedHistory);
  } catch (error) {
    return next(error);
  }
}

async function getQuotas(request, response, next) {
  try {
    const quotas = await gachaService.getPrizeQuotas();
    return response.status(200).json(quotas);
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinners();
    const data = winners.map((w) => ({
      user_id: w.user_id,
      user_name: maskName(w.user_name),
      hadiah: w.prize_id ? w.prize_id.name : 'Unknown',
      dimenangkan_pada: w.created_at,
    }));

    return response.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  rollGacha,
  getHistory,
  getQuotas,
  getWinners,
};

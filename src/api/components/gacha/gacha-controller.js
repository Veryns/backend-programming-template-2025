const gachaService = require('./gacha-service');

class GachaController {
  // Eksekusi Gacha
  roll = async (req, res) => {
    try {
      const { userId, userName } = req.body;
      if (!userId || !userName) {
        return res.status(400).json({
          message: 'userId dan userName harus diisi di body request.',
        });
      }

      const result = await gachaService.executeGacha(userId, userName);

      res.status(200).json({
        message: result
          ? `Wihhh Kamu Hokii!!. Kamu dapat ${result}`
          : 'Sorry kamu belum hoki, gas gacha lagi lahh',
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // Histori Gacha User
  getHistory = async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({
          message: 'userId harus ada di query parameter.',
        });
      }
      const history = await gachaService.getUserHistory(userId);
      res.status(200).json({ data: history });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Daftar Hadiah & Sisa Kuota
  getInventory = async (req, res) => {
    try {
      const inventory = await gachaService.getPrizeInventory();
      res.status(200).json({ data: inventory });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Daftar Pemenang (Nama Disamarkan)
  getWinnersList = async (req, res) => {
    try {
      const winners = await gachaService.getAnonymizedWinners();
      res.status(200).json({ data: winners });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = new GachaController();

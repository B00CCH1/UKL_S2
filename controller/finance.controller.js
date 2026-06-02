const prisma = require("../lib/prisma");

const getFinanceReport = async (req, res) => {
  try {
    const finances = await prisma.finance.findMany();

    const totalIncome = finances.reduce((acc, item) => {
      return acc + item.income;
    }, 0);

    res.json({
      totalIncome,
      finances,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getFinanceReport,
};

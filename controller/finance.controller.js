import prisma from "../lib/prisma.js";

export const getFinanceReport = async (_req, res) => {
  try {
    const finances = await prisma.finance.findMany({
      include: {
        transaction: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalIncome = finances.reduce((acc, item) => acc + item.income, 0);

    return res.json({
      totalIncome,
      finances,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

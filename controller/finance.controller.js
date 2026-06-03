import prisma from "../lib/prisma.js";

export const createFinance = async (req, res) => {
  try {
    const { transactionId, income, expense, description } = req.body;

    if (transactionId === undefined || income === undefined) {
      return res.status(400).json({
        message: "transactionId and income are required",
      });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const finance = await prisma.finance.create({
      data: {
        transactionId: Number(transactionId),
        userId: transaction.userId,
        income: Number(income),
        expense: expense ? Number(expense) : 0,
        description: description || null,
      },
      include: {
        transaction: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    return res.status(201).json(finance);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

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
    const totalExpense = finances.reduce((acc, item) => acc + item.expense, 0);

    return res.json({
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      finances,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllFinances = async (req, res) => {
  try {
    const {
      search,
      minIncome,
      maxIncome,
      minExpense,
      maxExpense,
      userId,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = "10",
      page = "1",
    } = req.query;

    const where = {};

    if (search) {
      where.description = { contains: search, mode: "insensitive" };
    }

    if (minIncome !== undefined || maxIncome !== undefined) {
      where.income = {};
      if (minIncome !== undefined) where.income.gte = Number(minIncome);
      if (maxIncome !== undefined) where.income.lte = Number(maxIncome);
    }

    if (minExpense !== undefined || maxExpense !== undefined) {
      where.expense = {};
      if (minExpense !== undefined) where.expense.gte = Number(minExpense);
      if (maxExpense !== undefined) where.expense.lte = Number(maxExpense);
    }

    if (userId !== undefined) {
      where.userId = Number(userId);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [finances, total] = await Promise.all([
      prisma.finance.findMany({
        where,
        include: {
          transaction: true,
          user: {
            omit: {
              password: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip,
        take: limitNum,
      }),
      prisma.finance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const totalIncome = finances.reduce((acc, item) => acc + item.income, 0);
    const totalExpense = finances.reduce((acc, item) => acc + item.expense, 0);

    return res.json({
      data: finances,
      summary: {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getFinanceById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const finance = await prisma.finance.findUnique({
      where: { id },
      include: {
        transaction: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!finance) {
      return res.status(404).json({
        message: "Finance record not found",
      });
    }

    return res.json(finance);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateFinance = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { income, expense, description } = req.body;

    const data = {
      ...(income !== undefined ? { income: Number(income) } : {}),
      ...(expense !== undefined ? { expense: Number(expense) } : {}),
      ...(description !== undefined ? { description } : {}),
    };

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "At least one field must be updated",
      });
    }

    const finance = await prisma.finance.update({
      where: { id },
      data,
      include: {
        transaction: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    return res.json(finance);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteFinance = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const finance = await prisma.finance.findUnique({
      where: { id },
    });

    if (!finance) {
      return res.status(404).json({
        message: "Finance record not found",
      });
    }

    await prisma.finance.delete({
      where: { id },
    });

    return res.json({
      message: "Finance record deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

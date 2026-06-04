import prisma from "../lib/prisma.js";

export const createTransaction = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "ProductId dan quantity harus diisi, quantity harus > 0",
      });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw Object.assign(new Error("Produk tidak ditemukan"), {
          statusCode: 404,
        });
      }

      if (product.stock < quantity) {
        throw Object.assign(new Error(`Stok tidak cukup. Tersedia: ${product.stock}`), { statusCode: 400 });
      }

      const totalPrice = product.price * quantity;

      const createdTransaction = await tx.transaction.create({
        data: {
          userId,
          productId,
          quantity,
          totalPrice,
        },
        include: {
          product: true,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      return createdTransaction;
    });

    return res.status(201).json({
      message: "Transaksi berhasil dibuat",
      data: {
        id: transaction.id,
        productName: transaction.product.name,
        productPrice: transaction.product.price,
        quantity: transaction.quantity,
        totalPrice: transaction.totalPrice,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    return res.status(error.statusCode ?? 500).json({
      message: error.message,
    });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        product: true,
        finance: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      userId,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = "10",
      page = "1",
    } = req.query;

    const where = {};

    if (search) {
      where.product = {
        name: { contains: search, mode: "insensitive" },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.totalPrice = {};
      if (minPrice !== undefined) where.totalPrice.gte = Number(minPrice);
      if (maxPrice !== undefined) where.totalPrice.lte = Number(maxPrice);
    }

    if (minQuantity !== undefined || maxQuantity !== undefined) {
      where.quantity = {};
      if (minQuantity !== undefined) where.quantity.gte = Number(minQuantity);
      if (maxQuantity !== undefined) where.quantity.lte = Number(maxQuantity);
    }

    if (userId !== undefined) {
      where.userId = Number(userId);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          product: true,
          finance: true,
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
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      data: transactions,
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

export const getTransactionById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        product: true,
        finance: true,
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: transaction.productId },
      });

      if (product) {
        await tx.product.update({
          where: { id: transaction.productId },
          data: {
            stock: {
              increment: transaction.quantity,
            },
          },
        });
      }

      await tx.transaction.delete({
        where: { id },
      });
    });

    return res.json({
      message: "Transaction deleted and stock restored",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

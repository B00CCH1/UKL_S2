import prisma from "../lib/prisma.js";

export const createTransaction = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Valid productId and quantity are required",
      });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw Object.assign(new Error("Product not found"), { statusCode: 404 });
      }

      if (product.stock < quantity) {
        throw Object.assign(new Error("Stock not enough"), { statusCode: 400 });
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

    return res.status(201).json(transaction);
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

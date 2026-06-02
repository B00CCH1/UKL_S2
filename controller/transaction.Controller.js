const prisma = require("../config/prisma");

const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Stock not enough",
      });
    }

    const totalPrice = product.price * quantity;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        productId,
        quantity,
        totalPrice,
      },
    });

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

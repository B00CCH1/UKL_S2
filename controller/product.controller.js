const prisma = require("../lib/prisma");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, description, price, stock } = req.body;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

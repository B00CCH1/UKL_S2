import prisma from "../lib/prisma.js";

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = "10",
      page = "1",
    } = req.query;

    const where = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    if (minStock !== undefined || maxStock !== undefined) {
      where.stock = {};
      if (minStock !== undefined) where.stock.gte = Number(minStock);
      if (maxStock !== undefined) where.stock.lte = Number(maxStock);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      data: products,
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

export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    return res.json({
      message: "Produk ditemukan",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: "Name, description, price, and stock are required",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, stock } = req.body;

    const data = {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(req.file ? { image: `/uploads/${req.file.filename}` } : {}),
    };

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return res.json(product);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    return res.json({
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

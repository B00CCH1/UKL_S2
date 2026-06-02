const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", getProducts);

router.post("/", authMiddleware, adminMiddleware, createProduct);

router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;

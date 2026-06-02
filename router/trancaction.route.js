const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createTransaction,
  getMyTransactions,
} = require("../controllers/transaction.controller");

router.post("/", authMiddleware, createTransaction);

router.get("/my-history", authMiddleware, getMyTransactions);

module.exports = router;

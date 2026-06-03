import { Router } from "express";
import {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
} from "../controller/transaction.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createTransaction);
router.get("/my", authMiddleware, getMyTransactions);
router.get("/all", authMiddleware, adminMiddleware, getAllTransactions);
router.get("/:id", authMiddleware, adminMiddleware, getTransactionById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTransaction);

export default router;

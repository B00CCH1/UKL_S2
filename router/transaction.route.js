import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTransaction,
  getMyTransactions,
} from "../controller/transaction.controller.js";

const router = Router();

router.post("/", authMiddleware, createTransaction);
router.get("/my-history", authMiddleware, getMyTransactions);

export default router;

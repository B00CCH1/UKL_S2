import { Router } from "express";
import {
  createTransaction,
  getMyTransactions,
} from "../controller/transaction.controller.js";

const router = Router();

router.post("/", createTransaction);
router.get("/my", getMyTransactions);

export default router;

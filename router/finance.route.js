import { Router } from "express";
import {
  createFinance,
  getFinanceReport,
  getAllFinances,
  getFinanceById,
  updateFinance,
  deleteFinance,
} from "../controller/finance.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, createFinance);
router.get("/report", authMiddleware, adminMiddleware, getFinanceReport);
router.get("/all", authMiddleware, adminMiddleware, getAllFinances);
router.get("/:id", authMiddleware, adminMiddleware, getFinanceById);
router.put("/:id", authMiddleware, adminMiddleware, updateFinance);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFinance);

export default router;

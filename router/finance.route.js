import { Router } from "express";
import { getFinanceReport } from "../controller/finance.controller.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, getFinanceReport);

export default router;

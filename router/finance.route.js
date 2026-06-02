import { Router } from "express";
import { getFinanceReport } from "../controller/finance.controller.js";

const router = Router();

router.get("/report", getFinanceReport);

export default router;

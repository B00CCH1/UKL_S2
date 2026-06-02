import { Router } from "express";
import {
  login,
  register,
  registerAdmin,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

export default router;

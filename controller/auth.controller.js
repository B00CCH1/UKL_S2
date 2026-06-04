import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Registrasi gagal: Nama, email, dan password harus diisi",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Registrasi gagal: Format email tidak valid (harus mengandung @)",
      });
    }

    const checkEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (checkEmail) {
      return res.status(400).json({
        message: "Registrasi gagal: Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ...(role ? { role } : {}),
      },
      omit: {
        password: true,
      },
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Registrasi gagal: ${error.message}`,
    });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!adminSecret || adminSecret.trim() !== (process.env.ADMIN_SECRET || "").trim()) {
      return res.status(403).json({
        message: "Registrasi admin gagal: Admin secret key tidak valid",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Registrasi admin gagal: Nama, email, dan password harus diisi",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Registrasi admin gagal: Format email tidak valid (harus mengandung @)",
      });
    }

    const checkEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (checkEmail) {
      return res.status(400).json({
        message: "Registrasi admin gagal: Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
      omit: {
        password: true,
      },
    });

    return res.status(201).json({
      message: "Registrasi admin berhasil",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Registrasi admin gagal: ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Login gagal: Email dan password harus diisi",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Login gagal: Format email tidak valid (harus mengandung @)",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Login gagal: Email tidak ditemukan",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Login gagal: Password salah",
      });
    }

    const token = generateToken(user);
    const { password: _password, ...safeUser } = user;

    return res.json({
      message: "Login berhasil",
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Login gagal: ${error.message}`,
    });
  }
};

import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const getUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.json({
      message: "User ditemukan",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Pembuatan user gagal: Nama, email, dan password harus diisi",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message:
          "Pembuatan user gagal: Format email tidak valid (harus mengandung @)",
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
      message: "Pembuatan user berhasil",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Pembuatan user gagal: ${error.message}`,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;

    if (email && !validateEmail(email)) {
      return res.status(400).json({
        message:
          "Update user gagal: Format email tidak valid (harus mengandung @)",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(password !== undefined
          ? { password: await bcrypt.hash(password, 10) }
          : {}),
        ...(role !== undefined ? { role } : {}),
      },
      omit: {
        password: true,
      },
    });

    return res.json({
      message: "Update user berhasil",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Update user gagal: ${error.message}`,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: { id },
    });

    return res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Penghapusan user gagal: ${error.message}`,
    });
  }
};

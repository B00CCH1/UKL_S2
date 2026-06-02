import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

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

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
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

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(password !== undefined ? { password: await bcrypt.hash(password, 10) } : {}),
        ...(role !== undefined ? { role } : {}),
      },
      omit: {
        password: true,
      },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
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
      message: "User deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

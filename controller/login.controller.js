const prisma = require("../lib/prisma");

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};

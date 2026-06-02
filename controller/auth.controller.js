const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).json({
        message: "Email already used",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

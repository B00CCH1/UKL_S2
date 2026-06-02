const express = require("express");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const transactionRoutes = require("./routes/transaction.routes");
const loginRoutes = require("./routes/login.route");
const financeRoutes = require("./routes/finance.route");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/finance", financeRoutes);

app.use("/api/login", loginRoutes);
module.exports = app;

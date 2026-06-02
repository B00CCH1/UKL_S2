import express from "express";
import authRoutes from "./router/auth.routes.js";
import financeRoutes from "./router/finance.route.js";
import loginRoutes from "./router/login.route.js";
import productRoutes from "./router/product.route.js";
import transactionRoutes from "./router/transaction.route.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.json({
    message: "UKL API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/login", loginRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;

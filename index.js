import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./router/auth.routes.js";
import financeRoutes from "./router/finance.route.js";
import loginRoutes from "./router/login.route.js";
import productRoutes from "./router/product.route.js";
import transactionRoutes from "./router/transaction.route.js";

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "https://ukls2-production.up.railway.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
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
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;

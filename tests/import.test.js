import assert from "node:assert/strict";
import test from "node:test";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/db";

const { generateToken, verifyToken } = await import("../utils/jwt.js");

test("JWT helper can generate and verify a token", () => {
  const token = generateToken({ id: 1, role: "ADMIN" });
  const payload = verifyToken(token);

  assert.equal(payload.id, 1);
  assert.equal(payload.role, "ADMIN");
});

test("Express app imports without CommonJS/ESM errors", async () => {
  const { default: app } = await import("../index.js");

  assert.equal(typeof app.use, "function");
});

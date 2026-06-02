import crypto from "node:crypto";

const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

const base64UrlEncode = (value) => {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
};

const base64UrlDecode = (value) => {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
};

const sign = (data, secret) => {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
};

export const generateToken = (user) => {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    id: user.id,
    role: user.role,
    iat: now,
    exp: now + JWT_EXPIRES_IN_SECONDS,
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token) => {
  const secret = getJwtSecret();
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error("Invalid token format");
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  if (
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    throw new Error("Invalid token signature");
  }

  const payload = base64UrlDecode(encodedPayload);

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
};

# 📚 Dokumentasi API UKL

**Base URL:** `http://localhost:3000/api`

---

## 🔐 AUTH (Authentication)

### 1️⃣ Register Client

**Endpoint:** `POST /api/auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "createdAt": "2026-06-03T10:30:00.000Z",
  "updatedAt": "2026-06-03T10:30:00.000Z"
}
```

---

### 2️⃣ Register Admin

**Endpoint:** `POST /api/auth/register-admin`

**Request:**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "adminSecret": "admin_secret_key_123"
}
```

**Response (201):**

```json
{
  "id": 2,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2026-06-03T10:35:00.000Z",
  "updatedAt": "2026-06-03T10:35:00.000Z"
}
```

---

### 3️⃣ Login

**Endpoint:** `POST /api/auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "createdAt": "2026-06-03T10:30:00.000Z",
    "updatedAt": "2026-06-03T10:30:00.000Z"
  }
}
```

---

## 📦 PRODUCTS

### 4️⃣ Get All Products (dengan filter & pagination)

**Endpoint:** `GET /api/products`

**Query Parameters:**

- `search` (optional): Cari berdasarkan nama
- `minPrice` (optional): Harga minimum
- `maxPrice` (optional): Harga maksimum
- `minStock` (optional): Stok minimum
- `maxStock` (optional): Stok maksimum
- `sortBy` (optional): Field untuk sorting (default: createdAt)
- `sortOrder` (optional): asc/desc (default: desc)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `page` (optional): Halaman (default: 1)

**Example Request:**

```
GET http://localhost:3000/api/products?search=laptop&minPrice=100&maxPrice=5000&page=1&limit=10
```

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop Gaming",
      "description": "Laptop gaming high performance",
      "price": 1500,
      "stock": 5,
      "image": "/uploads/laptop.jpg",
      "createdAt": "2026-06-03T10:40:00.000Z",
      "updatedAt": "2026-06-03T10:40:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 5️⃣ Create Product

**Endpoint:** `POST /api/products`

**Request (multipart/form-data):**

- `name` (required): Nama produk
- `description` (required): Deskripsi
- `price` (required): Harga
- `stock` (required): Jumlah stok
- `file` (optional): Gambar produk

**JSON Request Alternative:**

```json
{
  "name": "Mouse Wireless",
  "description": "Mouse gaming wireless RGB",
  "price": 50,
  "stock": 20
}
```

**Response (201):**

```json
{
  "id": 2,
  "name": "Mouse Wireless",
  "description": "Mouse gaming wireless RGB",
  "price": 50,
  "stock": 20,
  "image": null,
  "createdAt": "2026-06-03T10:45:00.000Z",
  "updatedAt": "2026-06-03T10:45:00.000Z"
}
```

---

### 6️⃣ Update Product

**Endpoint:** `PUT /api/products/:id`

**Request:**

```json
{
  "name": "Mouse Wireless Pro",
  "description": "Mouse gaming wireless RGB dengan battery 72 jam",
  "price": 75,
  "stock": 15
}
```

**Response (200):**

```json
{
  "id": 2,
  "name": "Mouse Wireless Pro",
  "description": "Mouse gaming wireless RGB dengan battery 72 jam",
  "price": 75,
  "stock": 15,
  "image": null,
  "createdAt": "2026-06-03T10:45:00.000Z",
  "updatedAt": "2026-06-03T10:50:00.000Z"
}
```

---

### 7️⃣ Delete Product

**Endpoint:** `DELETE /api/products/:id`

**Response (200):**

```json
{
  "message": "Product deleted"
}
```

---

## 💳 TRANSACTIONS

### 8️⃣ Create Transaction

**Endpoint:** `POST /api/transactions`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (201):**

```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "totalPrice": 3000,
  "createdAt": "2026-06-03T11:00:00.000Z",
  "updatedAt": "2026-06-03T11:00:00.000Z",
  "product": {
    "id": 1,
    "name": "Laptop Gaming",
    "description": "Laptop gaming high performance",
    "price": 1500,
    "stock": 3,
    "image": "/uploads/laptop.jpg",
    "createdAt": "2026-06-03T10:40:00.000Z",
    "updatedAt": "2026-06-03T11:00:00.000Z"
  }
}
```

---

### 9️⃣ Get My Transactions

**Endpoint:** `GET /api/transactions/my`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "quantity": 2,
    "totalPrice": 3000,
    "createdAt": "2026-06-03T11:00:00.000Z",
    "updatedAt": "2026-06-03T11:00:00.000Z",
    "product": {
      "id": 1,
      "name": "Laptop Gaming",
      "description": "Laptop gaming high performance",
      "price": 1500,
      "stock": 3,
      "image": "/uploads/laptop.jpg"
    },
    "finance": []
  }
]
```

---

## 💰 FINANCE

### 🔟 Get Finance Report

**Endpoint:** `GET /api/finance/report`

**Response (200):**

```json
{
  "totalIncome": 5000,
  "finances": [
    {
      "id": 1,
      "userId": 1,
      "transactionId": 1,
      "income": 3000,
      "createdAt": "2026-06-03T11:00:00.000Z",
      "updatedAt": "2026-06-03T11:00:00.000Z",
      "transaction": {
        "id": 1,
        "userId": 1,
        "productId": 1,
        "quantity": 2,
        "totalPrice": 3000
      },
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "client"
      }
    }
  ]
}
```

---

## 👥 USERS/LOGIN

### 1️⃣1️⃣ Get All Users

**Endpoint:** `GET /api/login`

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "createdAt": "2026-06-03T10:30:00.000Z",
    "updatedAt": "2026-06-03T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2026-06-03T10:35:00.000Z",
    "updatedAt": "2026-06-03T10:35:00.000Z"
  }
]
```

---

### 1️⃣2️⃣ Create User

**Endpoint:** `POST /api/login`

**Request:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "client"
}
```

**Response (201):**

```json
{
  "id": 3,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "client",
  "createdAt": "2026-06-03T11:10:00.000Z",
  "updatedAt": "2026-06-03T11:10:00.000Z"
}
```

---

### 1️⃣3️⃣ Update User

**Endpoint:** `PUT /api/login/:id`

**Request:**

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "newpassword123",
  "role": "admin"
}
```

**Response (200):**

```json
{
  "id": 3,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin",
  "createdAt": "2026-06-03T11:10:00.000Z",
  "updatedAt": "2026-06-03T11:15:00.000Z"
}
```

---

### 1️⃣4️⃣ Delete User

**Endpoint:** `DELETE /api/login/:id`

**Response (200):**

```json
{
  "message": "User deleted"
}
```

---

## 📝 POSTMAN COLLECTION (JSON)

Impor ke Postman: **File → Import → Paste raw text di bawah**

```json
{
  "info": {
    "name": "UKL API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"password\": \"password123\"}"
            }
          }
        },
        {
          "name": "Register Admin",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/register-admin",
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Admin\", \"email\": \"admin@example.com\", \"password\": \"admin123\", \"adminSecret\": \"admin_secret_key_123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"john@example.com\", \"password\": \"password123\"}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "message": "Name, email, and password are required"
}
```

### 404 Not Found

```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Error message"
}
```

---

**Tips:**

- Gunakan token dari login untuk endpoint yang membutuhkan authentication
- Semua request header harus `Content-Type: application/json`
- Replace `:id` dengan ID yang sebenarnya

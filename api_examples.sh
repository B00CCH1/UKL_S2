#!/bin/bash
# UKL API - Contoh CURL Commands
# Jalankan command di bawah di terminal/command prompt Anda

echo "========================================"
echo "       UKL API - CURL EXAMPLES"
echo "========================================"

# ========================================
# 1. AUTH - REGISTER CLIENT
# ========================================
echo -e "\n\n1️⃣  REGISTER CLIENT"
echo "---"
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# ========================================
# 2. AUTH - REGISTER ADMIN
# ========================================
echo -e "\n\n2️⃣  REGISTER ADMIN"
echo "---"
curl -X POST http://localhost:3000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "adminSecret": "admin_secret_key_123"
  }'

# ========================================
# 3. AUTH - LOGIN
# ========================================
echo -e "\n\n3️⃣  LOGIN"
echo "---"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# ========================================
# 4. PRODUCTS - GET ALL
# ========================================
echo -e "\n\n4️⃣  GET ALL PRODUCTS"
echo "---"
curl -X GET "http://localhost:3000/api/products?page=1&limit=10"

# ========================================
# 5. PRODUCTS - GET WITH FILTER
# ========================================
echo -e "\n\n5️⃣  GET PRODUCTS WITH FILTER"
echo "---"
curl -X GET "http://localhost:3000/api/products?search=laptop&minPrice=100&maxPrice=5000&page=1&limit=10"

# ========================================
# 6. PRODUCTS - CREATE
# ========================================
echo -e "\n\n6️⃣  CREATE PRODUCT"
echo "---"
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "description": "Laptop gaming high performance",
    "price": 1500,
    "stock": 10
  }'

# ========================================
# 7. PRODUCTS - UPDATE
# ========================================
echo -e "\n\n7️⃣  UPDATE PRODUCT (ID: 1)"
echo "---"
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming Pro",
    "description": "Laptop gaming high performance RTX 4070",
    "price": 2000,
    "stock": 5
  }'

# ========================================
# 8. PRODUCTS - DELETE
# ========================================
echo -e "\n\n8️⃣  DELETE PRODUCT (ID: 1)"
echo "---"
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json"

# ========================================
# 9. TRANSACTIONS - CREATE
# ========================================
echo -e "\n\n9️⃣  CREATE TRANSACTION"
echo "--- (Ganti TOKEN dengan token dari login)"
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'

# ========================================
# 10. TRANSACTIONS - GET MY TRANSACTIONS
# ========================================
echo -e "\n\n🔟 GET MY TRANSACTIONS"
echo "--- (Ganti TOKEN dengan token dari login)"
curl -X GET http://localhost:3000/api/transactions/my \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# ========================================
# 11. FINANCE - GET REPORT
# ========================================
echo -e "\n\n1️⃣1️⃣ GET FINANCE REPORT"
echo "---"
curl -X GET http://localhost:3000/api/finance/report \
  -H "Content-Type: application/json"

# ========================================
# 12. USERS - GET ALL
# ========================================
echo -e "\n\n1️⃣2️⃣ GET ALL USERS"
echo "---"
curl -X GET http://localhost:3000/api/login \
  -H "Content-Type: application/json"

# ========================================
# 13. USERS - CREATE
# ========================================
echo -e "\n\n1️⃣3️⃣ CREATE USER"
echo "---"
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "client"
  }'

# ========================================
# 14. USERS - UPDATE
# ========================================
echo -e "\n\n1️⃣4️⃣ UPDATE USER (ID: 1)"
echo "---"
curl -X PUT http://localhost:3000/api/login/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "newpassword123",
    "role": "admin"
  }'

# ========================================
# 15. USERS - DELETE
# ========================================
echo -e "\n\n1️⃣5️⃣ DELETE USER (ID: 1)"
echo "---"
curl -X DELETE http://localhost:3000/api/login/1 \
  -H "Content-Type: application/json"

echo -e "\n\n========================================\n"
echo "✅ Semua contoh API sudah ditampilkan!"
echo "========================================\n"

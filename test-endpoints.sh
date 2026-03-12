#!/bin/bash
TOKEN_JSON=$(curl -s -X POST http://localhost:8080/v1/auth/login -H "Content-Type: application/json" -d '{"email":"demo@stylo.id","password":"password123"}')
TOKEN=$(echo "$TOKEN_JSON" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "--- PAYMENT METHODS ---"
curl -s -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/v1/checkout/payment-methods | head -n 12

echo -e "\n--- TRY-ON AVATARS ---"
curl -s -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/v1/try-on/avatars | head -n 12

echo -e "\n--- TRY-ON GENERATE ---"
curl -s -X POST http://localhost:8080/v1/try-on/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"test-product","photo":"data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}'

echo -e "\n--- WISHLIST ADD ---"
curl -s -i -X POST http://localhost:8080/v1/wishlist \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":"test-product-123"}' | head -n 8

echo -e "\n--- WISHLIST GET ---"
curl -s -i -X GET http://localhost:8080/v1/wishlist \
  -H "Authorization: Bearer $TOKEN" | head -n 15

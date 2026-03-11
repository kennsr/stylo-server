# API Contract — Stylo App

## Overview

This document defines the complete API contract between the **Stylo App** (Flutter client) and the backend REST API.
All requests are JSON-based and follow a consistent response envelope. Authentication is performed via Bearer tokens.

---

## Base URLs

| Environment | Base URL                          |
| ----------- | --------------------------------- |
| Production  | `https://api.stylo.id/v1`         |
| Staging     | `https://staging-api.stylo.id/v1` |
| Mock        | `https://mock-api.stylo.id/v1`    |

---

## Common Conventions

### Request Headers

All authenticated endpoints require:

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

### Response Envelope

All successful responses must be wrapped in the following envelope:

```json
{
  "data": <payload>
}
```

> For list endpoints, `data` is a JSON array. For object endpoints, `data` is a JSON object.

### Error Response

```json
{
  "message": "Human-readable error description"
}
```

### HTTP Status Codes

| Code                        | Meaning                            |
| --------------------------- | ---------------------------------- |
| `200 OK`                    | Success                            |
| `201 Created`               | Resource successfully created      |
| `204 No Content`            | Success with no body               |
| `400 Bad Request`           | Invalid request body or parameters |
| `401 Unauthorized`          | Missing or invalid Bearer token    |
| `404 Not Found`             | Resource not found                 |
| `422 Unprocessable Entity`  | Validation error                   |
| `500 Internal Server Error` | Server-side error                  |

### Timeouts

- Connect timeout: **30 seconds**
- Receive timeout: **30 seconds**

---

## Interfaces (Shared Types)

### `User`

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  style_preferences: string[]; // Array of preference IDs
}
```

### `ProductVariant`

```typescript
interface ProductVariant {
  id: string;
  size: string; // e.g. "S", "M", "L", "XL"
  color: string; // e.g. "Red", "Blue"
  stock: number;
  additional_price?: number; // Added on top of base price
}
```

### `Product`

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  images: string[]; // Array of image URLs
  variants: ProductVariant[];
  rating: number; // 0.0–5.0
  review_count: number;
  stock: number;
  is_featured: boolean;
  has_ai_try_on: boolean;
}
```

### `ProductSummary`

```typescript
interface ProductSummary {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  discount_price?: number;
  rating?: number;
  category: string;
  has_ai_try_on: boolean;
}
```

### `Review`

```typescript
interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number; // 0.0–5.0
  comment: string;
  created_at: string; // ISO 8601
  images: string[]; // Array of image URLs
}
```

### `CartItem`

```typescript
interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  discount_price?: number;
}
```

### `Cart`

```typescript
interface Cart {
  items: CartItem[];
}
```

### `CartItemRef`

```typescript
interface CartItemRef {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  product_image?: string;
}
```

### `ShippingAddress`

```typescript
interface ShippingAddress {
  id: string;
  receiver_name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  label?: string; // e.g. "Home", "Office"
}
```

### `ShippingOption`

```typescript
interface ShippingOption {
  id: string;
  courier: string; // e.g. "JNE", "TIKI", "SiCepat"
  service: string; // e.g. "Regular", "Express"
  cost: number;
  estimated_days: number;
}
```

### `PlacedOrder`

```typescript
interface PlacedOrder {
  id: string;
  order_number: string;
  items: CartItemRef[];
  address: ShippingAddress;
  shipping: ShippingOption;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  created_at: string; // ISO 8601
}
```

### `OrderSummary`

```typescript
interface OrderSummary {
  id: string;
  order_number: string;
  item_count: number;
  total: number;
  status: string; // e.g. "pending", "processing", "shipped", "delivered", "cancelled"
  created_at: string; // ISO 8601
  first_item_image?: string;
  first_item_name?: string;
}
```

### `OrderDetail`

```typescript
interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  shipping_courier: string;
  shipping_service: string;
  receiver_name: string;
  address: string;
  phone: string;
  created_at: string; // ISO 8601
  items: OrderItem[];
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  product_image?: string;
}
```

### `TryOnResult`

```typescript
interface TryOnResult {
  id: string;
  product_id: string;
  original_image_url: string;
  result_image_url: string;
  created_at: string; // ISO 8601
  is_saved: boolean;
}
```

### `FitProfile`

```typescript
interface FitProfile {
  user_id?: string;
  height?: number; // in cm
  weight?: number; // in kg
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  preferred_size?: string; // e.g. "S", "M", "L"
}
```

### `StylePreference`

```typescript
interface StylePreference {
  id: string;
  name: string;
  is_selected: boolean;
}
```

### `Banner`

```typescript
interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  deep_link?: string; // In-app deep link URL
}
```

### `Category`

```typescript
interface Category {
  id: string;
  name: string;
  icon_url?: string;
  slug?: string;
}
```

### `Notification`

```typescript
interface Notification {
  id: string;
  title: string;
  body: string;
  type: string; // e.g. "order", "promo", "system"
  is_read: boolean;
  created_at: string; // ISO 8601
  image_url?: string;
  action_route?: string; // In-app navigation route
}
```

---

## Endpoints

---

## 🔐 Authentication

### `POST /auth/login`

Authenticate a user with email and password. Returns a user object containing a auth token.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string | null",
    "avatar_url": "string | null",
    "style_preferences": ["string"],
    "token": "string"
  }
}
```

> **Note:** The backend must include a `token` field in the `data` object. The client stores this token in `SharedPreferences` and sends it as a Bearer token on all subsequent authenticated requests.

---

### `POST /auth/register`

Register a new user account.

**Auth Required:** No

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response `201 Created`:**

```json
{
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string | null",
    "avatar_url": "string | null",
    "style_preferences": [],
    "token": "string"
  }
}
```

---

### `POST /auth/logout`

Invalidate the current auth token (server-side session revocation).

**Auth Required:** Yes

**Request Body:** _(empty)_

**Response `200 OK`:**

```json
{}
```

---

### `GET /auth/me`

Retrieve the currently authenticated user's profile.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string | null",
    "avatar_url": "string | null",
    "style_preferences": ["string"]
  }
}
```

---

## 🏠 Home

### `GET /home/banners`

Retrieve the list of promotional banners for the home screen carousel.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "image_url": "string",
      "title": "string | null",
      "subtitle": "string | null",
      "deep_link": "string | null"
    }
  ]
}
```

---

### `GET /products/categories`

Retrieve the list of product categories.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "icon_url": "string | null",
      "slug": "string | null"
    }
  ]
}
```

---

### `GET /products?featured=true`

Retrieve a list of featured products for the home page. Uses the same endpoint as the product list but filtered by `featured=true`.

**Auth Required:** Yes

**Query Parameters:**
| Name | Type | Required | Description |
|---|---|---|---|
| `featured` | `boolean` | Yes | Set to `true` to fetch featured products |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "image_url": "string | null",
      "discount_price": "number | null",
      "rating": "number | null",
      "category": "string",
      "has_ai_try_on": "boolean"
    }
  ]
}
```

---

## 👗 Products

### `GET /products`

Retrieve a paginated list of products, with optional filtering and search.

**Auth Required:** Yes

**Query Parameters:**
| Name | Type | Required | Description |
|---|---|---|---|
| `page` | `integer` | No | Page number (default: `1`) |
| `pageSize` | `integer` | No | Items per page (default: `20`) |
| `category` | `string` | No | Filter by category name |
| `search` | `string` | No | Full-text search query |
| `featured` | `boolean` | No | Filter to featured products only |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "discount_price": "number | null",
      "category": "string",
      "images": ["string"],
      "variants": [
        {
          "id": "string",
          "size": "string",
          "color": "string",
          "stock": "number",
          "additional_price": "number | null"
        }
      ],
      "rating": "number",
      "review_count": "number",
      "stock": "number",
      "is_featured": "boolean",
      "has_ai_try_on": "boolean"
    }
  ]
}
```

---

### `GET /products/:id`

Retrieve full details for a single product.

**Auth Required:** Yes

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `id` | `string` | Product ID |

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "discount_price": "number | null",
    "category": "string",
    "images": ["string"],
    "variants": [
      {
        "id": "string",
        "size": "string",
        "color": "string",
        "stock": "number",
        "additional_price": "number | null"
      }
    ],
    "rating": "number",
    "review_count": "number",
    "stock": "number",
    "is_featured": "boolean",
    "has_ai_try_on": "boolean"
  }
}
```

**Response `404 Not Found`:**

```json
{ "message": "Product not found" }
```

---

### `GET /products/search`

Search products by a text query.

**Auth Required:** Yes

**Query Parameters:**
| Name | Type | Required | Description |
|---|---|---|---|
| `q` | `string` | Yes | Search keyword |

**Response `200 OK`:**

```json
{
  "data": [
    {
      /* Product object (same as GET /products) */
    }
  ]
}
```

---

### `GET /products/:productId/reviews`

Retrieve all reviews for a specific product.

**Auth Required:** Yes

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `productId` | `string` | Product ID |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "user_name": "string",
      "user_avatar": "string | null",
      "rating": "number",
      "comment": "string",
      "created_at": "string (ISO 8601)",
      "images": ["string"]
    }
  ]
}
```

---

## 🛒 Cart

### `GET /cart`

Retrieve the current user's shopping cart.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": {
    "items": [
      {
        "id": "string",
        "product_id": "string",
        "product_name": "string",
        "product_image": "string",
        "price": "number",
        "quantity": "number",
        "size": "string",
        "color": "string",
        "discount_price": "number | null"
      }
    ]
  }
}
```

---

### `POST /cart/items`

Add a new item to the cart. Returns the updated cart.

**Auth Required:** Yes

**Request Body:**

```json
{
  "id": "string",
  "product_id": "string",
  "product_name": "string",
  "product_image": "string",
  "price": "number",
  "quantity": "number",
  "size": "string",
  "color": "string",
  "discount_price": "number | null"
}
```

**Response `200 OK`:**

```json
{
  "data": {
    /* Updated Cart object */
  }
}
```

---

### `PUT /cart/items/:itemId`

Update the quantity of an existing cart item. Returns the updated cart.

**Auth Required:** Yes

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `itemId` | `string` | Cart item ID |

**Request Body:**

```json
{
  "quantity": "number"
}
```

**Response `200 OK`:**

```json
{
  "data": {
    /* Updated Cart object */
  }
}
```

---

### `DELETE /cart/items/:itemId`

Remove an item from the cart. Returns the updated cart.

**Auth Required:** Yes

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `itemId` | `string` | Cart item ID |

**Response `200 OK`:**

```json
{
  "data": {
    /* Updated Cart object */
  }
}
```

---

## 💳 Checkout

### `GET /checkout/addresses`

Retrieve the list of saved shipping addresses for the current user.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "receiver_name": "string",
      "phone": "string",
      "street": "string",
      "city": "string",
      "province": "string",
      "postal_code": "string",
      "is_default": "boolean",
      "label": "string | null"
    }
  ]
}
```

> Fallback: The client also accepts the response as `{ "addresses": [...] }` if the `data` key is missing.

---

### `GET /checkout/shipping-rates`

Get available shipping options for a given address and weight.

**Auth Required:** Yes

**Query Parameters:**
| Name | Type | Required | Description |
|---|---|---|---|
| `address_id` | `string` | Yes | ID of the target shipping address |
| `weight` | `number` | Yes | Total weight of cart items (in grams) |

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "courier": "string",
      "service": "string",
      "cost": "number",
      "estimated_days": "number"
    }
  ]
}
```

> Fallback: The client also accepts `{ "shipping_options": [...] }` if the `data` key is missing.

---

### `POST /checkout/place-order`

Place an order using the current cart contents.

**Auth Required:** Yes

**Request Body:**

```json
{
  "address_id": "string",
  "shipping_option_id": "string",
  "payment_method": "string"
}
```

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "order_number": "string",
    "items": [
      {
        "product_id": "string",
        "product_name": "string",
        "quantity": "number",
        "price": "number",
        "size": "string",
        "color": "string",
        "product_image": "string | null"
      }
    ],
    "address": {
      /* ShippingAddress object */
    },
    "shipping": {
      /* ShippingOption object */
    },
    "payment_method": "string",
    "subtotal": "number",
    "shipping_cost": "number",
    "total": "number",
    "status": "string",
    "created_at": "string (ISO 8601)"
  }
}
```

---

## 📦 Orders

### `GET /orders`

Retrieve the list of all past orders for the current user.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "order_number": "string",
      "item_count": "number",
      "total": "number",
      "status": "string",
      "created_at": "string (ISO 8601)",
      "first_item_image": "string | null",
      "first_item_name": "string | null"
    }
  ]
}
```

> Fallback: The client also accepts `{ "orders": [...] }` if the `data` key is missing.

---

### `GET /orders/:orderId`

Retrieve full detail for a specific order.

**Auth Required:** Yes

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `orderId` | `string` | Order ID |

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "order_number": "string",
    "status": "string",
    "subtotal": "number",
    "shipping_cost": "number",
    "total": "number",
    "payment_method": "string",
    "shipping_courier": "string",
    "shipping_service": "string",
    "receiver_name": "string",
    "address": "string",
    "phone": "string",
    "created_at": "string (ISO 8601)",
    "items": [
      {
        "product_id": "string",
        "product_name": "string",
        "quantity": "number",
        "price": "number",
        "size": "string",
        "color": "string",
        "product_image": "string | null"
      }
    ]
  }
}
```

---

## 👤 Profile

### `GET /profile`

Retrieve the current user's profile.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string | null",
    "avatar_url": "string | null",
    "style_preferences": ["string"]
  }
}
```

---

### `PUT /profile`

Update the current user's profile.

**Auth Required:** Yes

**Request Body:**

```json
{
  "name": "string",
  "phone": "string" // optional
}
```

**Response `200 OK`:**

```json
{
  "data": {
    /* Updated User object */
  }
}
```

---

### `GET /profile/style-preferences`

Retrieve the full list of available style preferences with selection state for the current user.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "is_selected": "boolean"
    }
  ]
}
```

> Fallback: The client also accepts `{ "preferences": [...] }` if the `data` key is missing.

---

### `PUT /profile/style-preferences`

Update the style preferences for the current user.

**Auth Required:** Yes

**Request Body:**

```json
{
  "preference_ids": ["string"]
}
```

**Response `200 OK` or `204 No Content`**

---

### `GET /profile/fit-profile`

Retrieve the AI fit profile (body measurements) for the current user.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": {
    "user_id": "string | null",
    "height": "number | null",
    "weight": "number | null",
    "chest": "number | null",
    "waist": "number | null",
    "hips": "number | null",
    "preferred_size": "string | null"
  }
}
```

---

### `PUT /profile/fit-profile`

Save or update the AI fit profile for the current user.

**Auth Required:** Yes

**Request Body:**

```json
{
  "user_id": "string", // optional
  "height": "number", // optional
  "weight": "number", // optional
  "chest": "number", // optional
  "waist": "number", // optional
  "hips": "number", // optional
  "preferred_size": "string" // optional
}
```

> Only the fields that are non-null are included in the request body.

**Response `200 OK`:**

```json
{
  "data": {
    /* Updated FitProfile object */
  }
}
```

---

## 🤖 AI Try-On

### `POST /try-on/generate`

Generate a virtual try-on image by combining a user photo with a product.

**Auth Required:** Yes

**Request Body:**

```json
{
  "productId": "string",
  "photo": "string" // Base64-encoded user photo
}
```

**Response `200 OK`:**

```json
{
  "data": {
    "id": "string",
    "product_id": "string",
    "original_image_url": "string",
    "result_image_url": "string",
    "created_at": "string (ISO 8601)",
    "is_saved": "boolean"
  }
}
```

---

### `GET /try-on/results`

Retrieve the history of all AI try-on sessions for the current user.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "product_id": "string",
      "original_image_url": "string",
      "result_image_url": "string",
      "created_at": "string (ISO 8601)",
      "is_saved": "boolean"
    }
  ]
}
```

---

## 🔔 Notifications

### `GET /notifications`

Retrieve all notifications for the current user.

**Auth Required:** Yes

**Response `200 OK`:**

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "body": "string",
      "type": "string",
      "is_read": "boolean",
      "created_at": "string (ISO 8601)",
      "image_url": "string | null",
      "action_route": "string | null"
    }
  ]
}
```

---

### `PATCH /notifications/:id/read`

Mark a single notification as read.

**Auth Required:** Yes

**Path Parameters:**
| Name | Type | Description |
|---|---|---|
| `id` | `string` | Notification ID |

**Request Body:** _(empty)_

**Response `200 OK` or `204 No Content`**

---

### `PATCH /notifications/read-all`

Mark all notifications for the current user as read.

**Auth Required:** Yes

**Request Body:** _(empty)_

**Response `200 OK` or `204 No Content`**

---

## Endpoint Summary Table

| Method   | Path                         | Auth | Feature       | Description                    |
| -------- | ---------------------------- | ---- | ------------- | ------------------------------ |
| `POST`   | `/auth/login`                | ❌   | Auth          | Login with email & password    |
| `POST`   | `/auth/register`             | ❌   | Auth          | Register a new user            |
| `POST`   | `/auth/logout`               | ✅   | Auth          | Invalidate auth token          |
| `GET`    | `/auth/me`                   | ✅   | Auth          | Get current user               |
| `GET`    | `/home/banners`              | ✅   | Home          | Get promotional banners        |
| `GET`    | `/products/categories`       | ✅   | Home/Products | Get all categories             |
| `GET`    | `/products`                  | ✅   | Home/Products | List/search/filter products    |
| `GET`    | `/products/:id`              | ✅   | Products      | Get product detail             |
| `GET`    | `/products/search`           | ✅   | Products      | Search products by keyword     |
| `GET`    | `/products/:id/reviews`      | ✅   | Products      | Get product reviews            |
| `GET`    | `/cart`                      | ✅   | Cart          | Get current user's cart        |
| `POST`   | `/cart/items`                | ✅   | Cart          | Add item to cart               |
| `PUT`    | `/cart/items/:itemId`        | ✅   | Cart          | Update cart item quantity      |
| `DELETE` | `/cart/items/:itemId`        | ✅   | Cart          | Remove item from cart          |
| `GET`    | `/checkout/addresses`        | ✅   | Checkout      | Get saved shipping addresses   |
| `GET`    | `/checkout/shipping-rates`   | ✅   | Checkout      | Get shipping options           |
| `POST`   | `/checkout/place-order`      | ✅   | Checkout      | Place new order                |
| `GET`    | `/orders`                    | ✅   | Orders        | List all orders                |
| `GET`    | `/orders/:orderId`           | ✅   | Orders        | Get order detail               |
| `GET`    | `/profile`                   | ✅   | Profile       | Get user profile               |
| `PUT`    | `/profile`                   | ✅   | Profile       | Update user profile            |
| `GET`    | `/profile/style-preferences` | ✅   | Profile       | Get style preferences          |
| `PUT`    | `/profile/style-preferences` | ✅   | Profile       | Update style preferences       |
| `GET`    | `/profile/fit-profile`       | ✅   | AI Try-On     | Get body fit profile           |
| `PUT`    | `/profile/fit-profile`       | ✅   | AI Try-On     | Save body fit profile          |
| `POST`   | `/try-on/generate`           | ✅   | AI Try-On     | Generate try-on image          |
| `GET`    | `/try-on/results`            | ✅   | AI Try-On     | Get try-on history             |
| `GET`    | `/notifications`             | ✅   | Notifications | Get all notifications          |
| `PATCH`  | `/notifications/:id/read`    | ✅   | Notifications | Mark notification as read      |
| `PATCH`  | `/notifications/read-all`    | ✅   | Notifications | Mark all notifications as read |

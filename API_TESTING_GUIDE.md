# Vehicle Marketplace — Postman API Testing Guide

> **Base URL:** `http://localhost:5000`
>
> Make sure the backend server is running before testing: `cd backend && npm run dev`

---

## Table of Contents

1. [Setup Postman](#1-setup-postman)
2. [Authentication APIs](#2-authentication-apis)
3. [Marketplace APIs (Public)](#3-marketplace-apis-public)
4. [Marketplace APIs (Protected)](#4-marketplace-apis-protected)
5. [Testing Workflow](#5-complete-testing-workflow)

---

## 1. Setup Postman

### Step 1: Create Environment Variables

In Postman, go to **Environments** → **Create New** and add these variables:

| Variable     | Initial Value                  |
|-------------|-------------------------------|
| `base_url`  | `http://localhost:5000`       |
| `token`     | *(leave empty — auto-filled)* |

### Step 2: Set Headers for Protected Routes

For any route marked **🔒 Protected**, you must add this header:

| Key             | Value              |
|-----------------|-------------------|
| `Authorization` | `Bearer {{token}}` |

### Step 3: Content-Type

- For **JSON** requests: Set `Content-Type` to `application/json`
- For **FormData** requests (image upload): Do **NOT** set Content-Type — Postman will auto-set it with the boundary

---

## 2. Authentication APIs

### 2.1 Register a New Seller Account

| Setting     | Value                                 |
|------------|---------------------------------------|
| **Method** | `POST`                                |
| **URL**    | `{{base_url}}/api/auth/register`      |
| **Body**   | `raw` → `JSON`                        |

**Request Body:**
```json
{
  "name": "Sishan Hewapathirana",
  "email": "sishanhewa4@gmail.com",
  "password": "password123",
  "phone": "+94771234567"
}
```

**Expected Response (201 Created):**
```json
{
  "_id": "69c913048eac2f3093fe3b5f",
  "name": "Sishan Hewapathirana",
  "email": "sishanhewa4@gmail.com",
  "phone": "+94771234567",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

> **⚡ Important:** Copy the `token` value from the response and paste it into your Postman environment variable `token`. All protected routes need this.

**Possible Errors:**

| Status | Message                                              |
|--------|------------------------------------------------------|
| 400    | `Please append all required fields to create a Seller Account` |
| 400    | `Seller Account already exists with this email`      |

---

### 2.2 Login to Existing Account

| Setting     | Value                            |
|------------|----------------------------------|
| **Method** | `POST`                           |
| **URL**    | `{{base_url}}/api/auth/login`    |
| **Body**   | `raw` → `JSON`                   |

**Request Body:**
```json
{
  "email": "sishanhewa4@gmail.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "_id": "69c913048eac2f3093fe3b5f",
  "name": "Sishan Hewapathirana",
  "email": "sishanhewa4@gmail.com",
  "phone": "+94771234567",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

> **⚡ Copy the `token` into your environment variable again** (tokens might differ between sessions).

**Possible Errors:**

| Status | Message                        |
|--------|--------------------------------|
| 401    | `Invalid email or password`    |

---

### 2.3 Get Current User Profile 🔒

| Setting     | Value                             |
|------------|-----------------------------------|
| **Method** | `GET`                             |
| **URL**    | `{{base_url}}/api/auth/profile`   |
| **Headers**| `Authorization: Bearer {{token}}` |

**Expected Response (200 OK):**
```json
{
  "_id": "69c913048eac2f3093fe3b5f",
  "name": "Sishan Hewapathirana",
  "email": "sishanhewa4@gmail.com",
  "phone": "+94771234567",
  "role": "User",
  "createdAt": "2026-03-29T..."
}
```

---

## 3. Marketplace APIs (Public)

These endpoints do **NOT** require authentication.

### 3.1 Get All Listings (No Filters)

| Setting     | Value                              |
|------------|-------------------------------------|
| **Method** | `GET`                               |
| **URL**    | `{{base_url}}/api/marketplace`      |

**Expected Response (200 OK):** Array of vehicle listing objects.

---

### 3.2 Get All Listings (With Filters)

| Setting     | Value                              |
|------------|-------------------------------------|
| **Method** | `GET`                               |
| **URL**    | `{{base_url}}/api/marketplace`      |
| **Params** | See query parameters below          |

Add any combination of these as **Query Params** in Postman (Params tab):

| Key            | Example Value | Description                      |
|----------------|--------------|----------------------------------|
| `make`         | `Toyota`     | Case-insensitive make search     |
| `model`        | `Prius`      | Case-insensitive model search    |
| `location`     | `Colombo`    | Exact district match             |
| `condition`    | `Used`       | `New`, `Used`, or `Reconditioned`|
| `fuelType`     | `Hybrid`     | `Petrol`, `Diesel`, `Hybrid`, `Electric` |
| `transmission` | `Automatic`  | `Automatic`, `Manual`, `Tiptronic` |
| `bodyType`     | `SUV`        | `Sedan`, `Hatchback`, `SUV`, etc. |
| `minPrice`     | `5000000`    | Minimum price (Rs.)              |
| `maxPrice`     | `15000000`   | Maximum price (Rs.)              |
| `yearMin`      | `2018`       | Minimum year of manufacture      |
| `yearMax`      | `2023`       | Maximum year of manufacture      |
| `sellerId`     | `69c91304...`| Filter by specific seller        |

**Example URL with filters:**
```
{{base_url}}/api/marketplace?make=Toyota&location=Colombo&minPrice=5000000&maxPrice=15000000
```

---

### 3.3 Get Single Listing by ID

| Setting     | Value                                       |
|------------|----------------------------------------------|
| **Method** | `GET`                                        |
| **URL**    | `{{base_url}}/api/marketplace/:id`           |

Replace `:id` with an actual listing ID, e.g.:
```
{{base_url}}/api/marketplace/67e813a8b1c2d3e4f5a6b7c8
```

**Expected Response (200 OK):** Single listing object with seller details populated:
```json
{
  "_id": "67e813a8b1c2d3e4f5a6b7c8",
  "title": "2021 Toyota Prius for Sale in Colombo",
  "make": "Toyota",
  "model": "Prius",
  "sellerId": {
    "_id": "69c913048eac2f3093fe3b5f",
    "name": "Sishan Hewapathirana",
    "phone": "+94771234567",
    "email": "sishanhewa4@gmail.com"
  },
  ...
}
```

---

## 4. Marketplace APIs (Protected)

> **🔒 All these routes require the `Authorization: Bearer {{token}}` header.**

### 4.1 Create New Listing 🔒

| Setting     | Value                              |
|------------|-------------------------------------|
| **Method** | `POST`                              |
| **URL**    | `{{base_url}}/api/marketplace`      |
| **Headers**| `Authorization: Bearer {{token}}`   |
| **Body**   | `form-data`                         |

**Form-Data Fields:**

| Key              | Type   | Value                                      | Required |
|-----------------|--------|---------------------------------------------|----------|
| `title`         | Text   | `2023 Toyota Aqua for Sale in Colombo`     | ✅       |
| `make`          | Text   | `Toyota`                                    | ✅       |
| `model`         | Text   | `Aqua`                                      | ✅       |
| `year`          | Text   | `2023`                                      | ✅       |
| `price`         | Text   | `8500000`                                   | ✅       |
| `mileage`       | Text   | `25000`                                     | ✅       |
| `transmission`  | Text   | `Automatic`                                 | ✅       |
| `fuelType`      | Text   | `Hybrid`                                    | ✅       |
| `engineCapacity`| Text   | `1500`                                      | ✅       |
| `bodyType`      | Text   | `Hatchback`                                 | ✅       |
| `location`      | Text   | `Colombo`                                   | ✅       |
| `condition`     | Text   | `Reconditioned`                             | ❌       |
| `isNegotiable`  | Text   | `true`                                      | ❌       |
| `description`   | Text   | `Single owner, mint condition...`           | ❌       |
| `images`        | File   | *(Select image file from your computer)*    | ❌       |

> **How to add images in Postman:**
> 1. Set the key name to `images`
> 2. Change the type dropdown from "Text" to **"File"**
> 3. Click "Select Files" and choose up to 5 images
> 4. You can add multiple `images` keys for multiple files

**Expected Response (201 Created):**
```json
{
  "_id": "newly-generated-id",
  "title": "2023 Toyota Aqua for Sale in Colombo",
  "make": "Toyota",
  "sellerId": "69c913048eac2f3093fe3b5f",
  "images": ["/uploads/1711789200000-image.jpg"],
  ...
}
```

---

### 4.2 Update Existing Listing 🔒

| Setting     | Value                                       |
|------------|----------------------------------------------|
| **Method** | `PUT`                                        |
| **URL**    | `{{base_url}}/api/marketplace/:id`           |
| **Headers**| `Authorization: Bearer {{token}}`            |
| **Body**   | `raw` → `JSON`                               |

Replace `:id` with the listing ID you want to update.

**Request Body (include only fields to update):**
```json
{
  "price": 7900000,
  "mileage": 30000,
  "description": "Updated description - price slightly reduced",
  "status": "Sold",
  "isNegotiable": false
}
```

**Expected Response (200 OK):** The updated listing object.

**Possible Errors:**

| Status | Message                           |
|--------|-----------------------------------|
| 404    | `Listing not found`               |
| 401    | `Not authorized to edit this ad`  |

> **Note:** You can only update listings that belong to your account. Attempting to update another seller's listing will return a 401 error.

---

### 4.3 Delete a Listing 🔒

| Setting     | Value                                       |
|------------|----------------------------------------------|
| **Method** | `DELETE`                                     |
| **URL**    | `{{base_url}}/api/marketplace/:id`           |
| **Headers**| `Authorization: Bearer {{token}}`            |

Replace `:id` with the listing ID you want to delete.

**Expected Response (200 OK):**
```json
{
  "message": "Listing removed successfully"
}
```

**Possible Errors:**

| Status | Message                              |
|--------|--------------------------------------|
| 404    | `Listing not found`                  |
| 401    | `Not authorized to delete this Ad`   |

---

### 4.4 Get My Listings (Seller Dashboard) 🔒

| Setting     | Value                                          |
|------------|------------------------------------------------|
| **Method** | `GET`                                          |
| **URL**    | `{{base_url}}/api/marketplace/my-listings`     |
| **Headers**| `Authorization: Bearer {{token}}`              |

**Expected Response (200 OK):** Array of listings where `sellerId` matches the authenticated user.

---

## 5. Complete Testing Workflow

Follow this exact order to test the full system end-to-end:

### Step 1: Register
```
POST {{base_url}}/api/auth/register
```
Copy the `token` from the response → Set it in your environment variables.

### Step 2: Login (Alternative to Step 1)
```
POST {{base_url}}/api/auth/login
```
Copy the `token` from the response.

### Step 3: View Profile
```
GET {{base_url}}/api/auth/profile
Headers: Authorization: Bearer {{token}}
```
Verify your user details are returned.

### Step 4: Create a Listing
```
POST {{base_url}}/api/marketplace
Headers: Authorization: Bearer {{token}}
Body: form-data with vehicle details + image
```
Copy the `_id` from the response for the next steps.

### Step 5: View All Listings
```
GET {{base_url}}/api/marketplace
```
Verify your new listing appears in the results.

### Step 6: View Single Listing
```
GET {{base_url}}/api/marketplace/{id}
```
Verify all details including populated seller information.

### Step 7: Search with Filters
```
GET {{base_url}}/api/marketplace?make=Toyota&location=Colombo&fuelType=Hybrid
```
Verify only matching listings are returned.

### Step 8: View My Listings
```
GET {{base_url}}/api/marketplace/my-listings
Headers: Authorization: Bearer {{token}}
```
Verify only your own listings appear.

### Step 9: Update a Listing
```
PUT {{base_url}}/api/marketplace/{id}
Headers: Authorization: Bearer {{token}}
Body: {"price": 7500000, "status": "Sold"}
```
Verify the listing is updated.

### Step 10: Delete a Listing
```
DELETE {{base_url}}/api/marketplace/{id}
Headers: Authorization: Bearer {{token}}
```
Verify the listing is removed.

---

## API Summary Table

| # | Method   | Endpoint                              | Auth   | Description                    |
|---|----------|---------------------------------------|--------|--------------------------------|
| 1 | `POST`   | `/api/auth/register`                  | ❌     | Register new seller account    |
| 2 | `POST`   | `/api/auth/login`                     | ❌     | Login to existing account      |
| 3 | `GET`    | `/api/auth/profile`                   | 🔒     | Get current user profile       |
| 4 | `GET`    | `/api/marketplace`                    | ❌     | Get all listings (with filters)|
| 5 | `GET`    | `/api/marketplace/:id`               | ❌     | Get single listing details     |
| 6 | `POST`   | `/api/marketplace`                    | 🔒     | Create new listing             |
| 7 | `PUT`    | `/api/marketplace/:id`               | 🔒     | Update existing listing        |
| 8 | `DELETE` | `/api/marketplace/:id`               | 🔒     | Delete a listing               |
| 9 | `GET`    | `/api/marketplace/my-listings`       | 🔒     | Get logged-in user's listings  |

---

## Valid Enum Values Reference

Use these exact values in your requests:

| Field          | Accepted Values                                    |
|----------------|---------------------------------------------------|
| `transmission` | `Manual`, `Automatic`, `Tiptronic`                |
| `fuelType`     | `Petrol`, `Diesel`, `Hybrid`, `Electric`          |
| `condition`    | `New`, `Used`, `Reconditioned`                    |
| `status`       | `Available`, `Sold`                               |
| `bodyType`     | `Sedan`, `Hatchback`, `SUV`, `Coupé`, `Van`, `Pickup`, `Jeep` |
| `location`     | `Colombo`, `Kandy`, `Gampaha`, `Kurunegala`, `Kalutara`, `Galle`, `Matara`, `Ratnapura`, `Anuradhapura`, `Jaffna`, `Batticaloa`, `Badulla` |

# 🛒 ShopEZ – Full Stack MERN E-commerce Application

ShopEZ is a **full-stack E-commerce web application** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.
It allows users to browse products, add items to a cart, place orders, and manage their purchases.
An **admin dashboard** enables product management, order tracking, and platform monitoring.

This project demonstrates a **production-style architecture**, including authentication, role-based access control, REST APIs, and a responsive UI.

---

# 📌 Table of Contents

* Project Overview
* Features
* Tech Stack
* System Architecture
* Folder Structure
* Installation & Setup
* Environment Variables
* API Endpoints
* Screenshots
* Future Improvements
* Contributors
* License

---

# 🚀 Project Overview

**Project Name:** ShopEZ
**Type:** Full-Stack E-commerce Web Application

ShopEZ provides a seamless online shopping experience where users can:

* Browse products
* Filter and search items
* Add products to cart
* Place orders
* View order history
* Manage profile

Administrators can:

* Add or update products
* Manage orders
* View platform analytics
* Control homepage banners

---

# ✨ Features

## 👤 User Features

* User registration & login (JWT Authentication)
* Secure password hashing with bcrypt
* Product browsing with filters
* Product details page
* Add to cart functionality
* Cart management (update quantity/remove item)
* Checkout system
* Order placement
* Order history tracking
* User profile management

---

## 🛍 Product Features

* Product listing
* Category filtering
* Price sorting
* Discount display
* Product images carousel
* Product size selection

---

## 🧑‍💼 Admin Features

* Admin dashboard overview
* Add new products
* Update existing products
* Delete products
* View all orders
* Update order status
* Manage homepage banners

---

# 🧰 Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* CSS / Bootstrap

## Backend

* Node.js
* Express.js
* REST API

## Database

* MongoDB
* Mongoose ODM

## Authentication

* JSON Web Token (JWT)
* bcrypt.js

---

# 🏗 System Architecture

The project follows the **MVC (Model-View-Controller) architecture**.

Client (React)
⬇
API Requests (Axios)
⬇
Express Server (Routes + Controllers)
⬇
MongoDB Database (Mongoose Models)

This architecture ensures:

* Separation of concerns
* Scalability
* Maintainability

---

# 📁 Folder Structure

```
shopez
│
├── frontend               # React Frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── backend               # Node.js Backend
│   ├── config
│   ├── models
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/shopez.git
cd shopez
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Start the server:

```bash
nodemon index.js
```

Backend runs on:

```
http://localhost:8000
```

---

### 3️⃣ Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **server** folder.

Example:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_jwt_secret
```

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

## Products

```
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Cart

```
GET /api/cart/:userId
POST /api/cart
PUT /api/cart/:id
DELETE /api/cart/:id
```

## Orders

```
POST /api/orders
GET /api/orders
GET /api/orders/:userId
PUT /api/orders/:id
```

---
# 🔮 Future Improvements

* Online payment integration (Stripe / Razorpay)
* Product reviews and ratings
* Wishlist functionality
* Email notifications
* Order tracking with delivery updates
* Advanced search with AI recommendations

---

# 👨‍💻 Contributors

Team Members:

* Tushar Kewat
* Uday Kanojiya

---

# 📜 License

This project is developed for **educational and demonstration purposes**.

---

⭐ If you found this project useful, please consider **starring the repository**.


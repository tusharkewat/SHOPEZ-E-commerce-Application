# 🛍️ ShopEZ — Full-Stack E-Commerce Application

**ShopEZ** is a full-stack e-commerce web application built with React, Node.js, Express.js, and MongoDB. It provides an online shopping experience with product discovery, filtering, cart and order workflows, user authentication, and administrative product management.

🔗 **Live Demo:** [ShopEZ E-Commerce Application](https://shopez-e-commerce-application-bljw.onrender.com)

📂 **GitHub Repository:** [SHOPEZ-E-commerce-Application](https://github.com/tusharkewat/SHOPEZ-E-commerce-Application)

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation and Setup](#️-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🚀 Project Overview

ShopEZ demonstrates the development of a full-stack online shopping platform with a separate frontend, backend API, and database.

Customers can explore available products, search and filter the catalog, manage their shopping experience, and interact with order-related functionality.

Administrative functionality supports product management and other platform operations through protected API routes.

The project demonstrates practical experience with frontend development, REST API integration, database operations, authentication, authorization, and deployment.

## ✨ Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Password hashing
- Product browsing and search
- Category filtering and price sorting
- Product details
- Shopping cart and checkout workflows
- Order-related functionality
- User-related API operations

### 🛍️ Product Features

- Product catalog
- Search by product name and description
- Category filtering
- Price-range filtering
- Price sorting
- Product images and descriptions
- Product sizes, discounts, and stock information where available
- Product reviews and ratings

### 🧑‍💼 Admin Features

- Protected product creation
- Update and delete product operations
- Seller-specific product retrieval
- Order management API
- Homepage banner API
- Role-based access control for protected operations

*Feature availability may depend on the current frontend implementation and deployment configuration.*

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Routing | React Router |
| API Communication | Axios, REST APIs |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| Deployment | Render |
| Version Control | Git, GitHub |

---

## 🏗️ System Architecture

ShopEZ separates the frontend, backend API, and database responsibilities.

```text
                  User / Browser
                        |
                        v
                React + Vite Frontend
                        |
                  HTTP / REST API
                        |
                        v
              Node.js + Express Backend
                        |
             Authentication & Middleware
                        |
                        v
                 Mongoose Models
                        |
                        v
                  MongoDB Atlas
```

### Architecture Highlights

- **Frontend:** Renders the user interface and communicates with the backend.
- **Backend:** Handles API requests, application logic, and protected operations.
- **Authentication:** Uses JWT-based authentication and authorization middleware.
- **Database:** Stores application data in MongoDB.
- **Deployment:** The frontend and backend are configured to run through the Render deployment, while MongoDB Atlas provides the database.

---

## 📁 Project Structure

```text
SHOPEZ-E-commerce-Application/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- A MongoDB Atlas account or another MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/tusharkewat/SHOPEZ-E-commerce-Application.git
cd SHOPEZ-E-commerce-Application
```

### 2. Configure and Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the required environment variables.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

Use the exact environment variable names expected by the backend source code. If the authentication code reads `SECRET_KEY` or another name instead of `JWT_SECRET`, configure the matching name.

Start the development server:

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

Check the health endpoint:

[http://localhost:5000/api/health](http://localhost:5000/api/health)

Expected response:

```json
{
  "status": "ok",
  "message": "ShopEZ backend is running"
}
```

### 3. Configure and Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal, typically:

`http://localhost:5173`

Ensure that the Vite development proxy forwards `/api` requests to `http://localhost:5000`.

### 4. Build for Production

Build the frontend:

```bash
cd frontend
npm run build
```

The generated frontend files should be available in `frontend/dist`.

Compile the backend:

```bash
cd backend
npm run build
```

Run the production server using the configured backend start script:

```bash
npm start
```

---

## 🔑 Environment Variables

Configure environment variables locally in `backend/.env` and in the deployment platform.

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` or configured equivalent | Secret used for JWT signing and verification |

**Security best practices:**

- Never commit your real `.env` file to GitHub.
- Use a strong, randomly generated secret for production.
- Configure secrets through Render's environment settings.
- Keep placeholder values in `.env.example`.
- Restrict database access and configure MongoDB Atlas network access appropriately.

---

## 🔌 API Endpoints

The backend provides the following route groups:

| Endpoint | Description |
|---|---|
| `GET /api/health` | Backend health check |
| `/api/auth` | Authentication operations |
| `/api/products` | Product listing, filtering, sorting, and management |
| `/api/orders` | Order-related operations |
| `/api/users` | User-related operations |
| `/api/banner` | Homepage banner operations |

The product routes include endpoints for individual product details, seller-specific products, product creation and updates, deletion, and reviews. Protected endpoints require the appropriate authentication and authorization.

Refer to the route files in `backend/src/routes` for exact HTTP methods, request formats, and response details.

---

## 🌐 Deployment

ShopEZ is deployed on Render, with MongoDB Atlas providing database storage.

**Live application:** [https://shopez-e-commerce-application-bljw.onrender.com](https://shopez-e-commerce-application-bljw.onrender.com)

Deployment involves:

1. Installing frontend and backend dependencies.
2. Building the React frontend.
3. Compiling the TypeScript backend.
4. Configuring production environment variables.
5. Connecting the backend to MongoDB Atlas.
6. Serving the frontend build and backend API through the deployed service.

---

## 🔮 Future Improvements

- [ ] Integrate a payment gateway such as Razorpay in test mode.
- [ ] Add a wishlist feature.
- [ ] Add automated frontend and backend tests.
- [ ] Improve product pagination and filtering.
- [ ] Enhance responsive design and accessibility.
- [ ] Add comprehensive API documentation.
- [ ] Improve inventory validation and order processing.
- [ ] Add sales analytics to the admin dashboard.
- [ ] Implement order status tracking and customer notifications.

---

## 👨‍💻 Contributors

This project was developed collaboratively by:

- **Tushar Kewat**
- **Uday Kanojiya**

---

## 📜 License

This project was developed for educational and demonstration purposes. No specific open-source license is declared here; add a `LICENSE` file if you intend to distribute it under a particular license.

---

⭐ If you find this project interesting, consider starring the repository.

**Built with React, Node.js, Express, and MongoDB.**

# 💻 DevTinder – Backend

A production-ready backend for **DevTinder**, an app designed to help developers connect, collaborate, and grow together. Built with **Node.js, Express, and MongoDB** following industry best practices.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**

  - Secure signup & login with JWT-based authentication
  - Role-based access control for different user types

- 👤 **Profile Management**

  - Create, update, and delete user profiles
  - Strong password validation & encryption using bcrypt

- 🤝 **Match System**

  - Send, accept, or ignore connection requests
  - Status-based notifications (e.g., “Sagar is interested in Yogesh”)

- ⚙️ **Production-Ready Setup**

  - Centralized error handling & validation middleware
  - Environment variables managed with dotenv
  - Modular routes & controllers for scalability

- 🗄️ **Database**
  - MongoDB with Mongoose for schema validation & queries
  - Indexing for optimized lookups

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: Bcrypt, JWT, Helmet, Rate-limiter
- **Environment**: dotenv

---

## API Endpoints

### authRouter

- POST /signup
- POST /login
- POST /logout

### profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

### connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

- GET /user/connection
- GET /user/requests/received
- GET /user/feed - gets you profile of other users on platform

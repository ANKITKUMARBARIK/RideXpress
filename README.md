# 🔐 AuthMicroservices_Gateway

A professional and scalable microservices-based authentication system using **Node.js**, **Express**, and **API Gateway** architecture.

## 🚀 Project Overview

This project demonstrates how to structure authentication functionality within a microservices architecture. It includes:
- 🧩 **Auth Service**: Handles user authentication, registration, OTP verification, password resets, and token refresh logic.
- 🌐 **API Gateway**: Acts as a single entry point that proxies requests to internal microservices.

---

## 🛠️ Technologies Used
- Node.js
- Express.js
- express-http-proxy
- JSON Web Token (JWT)
- UUID / Nanoid for unique IDs
- Environment variables using dotenv

---

## 📁 Project Structure

```
AuthMicroservices_Gateway/
│
├── api-gateway/               # API Gateway - handles routing & proxying
│   └── index.js
│
├── auth-service/              # Authentication microservice
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── .env                       # Environment variables
└── README.md                  # Project overview & instructions
```

---

## ⚙️ Features

- ✅ User Registration
- ✅ Login / Logout
- ✅ Refresh Token system
- ✅ OTP verification & Resend OTP
- ✅ Forgot / Reset Password
- ✅ API Gateway Routing
- ✅ Middleware based token verification

---

## 📦 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/ANKITKUMARBARIK/AuthMicroservices_Gateway.git
cd AuthMicroservices_Gateway
```

2. Install dependencies in each service folder:
```bash
cd auth-service
npm install

cd ../api-gateway
npm install
```

3. Start services:
```bash
# In one terminal (Auth Service)
cd auth-service
npm run dev

# In another terminal (API Gateway)
cd api-gateway
npm run dev
```

---

## 📌 Endpoints Overview

| Method | Endpoint                   | Description            |
|--------|----------------------------|------------------------|
| POST   | /register                  | Register user          |
| POST   | /login                     | Login user             |
| POST   | /logout                    | Logout user            |
| POST   | /refresh-token             | Refresh JWT            |
| POST   | /verify-signup             | Verify OTP             |
| POST   | /resend-otp                | Resend OTP             |
| POST   | /forgot-password           | Forgot password        |
| POST   | /reset-password            | Reset password         |

---

## 🔮 Future Improvements

- 🔐 Role-based access control
- 🐳 Docker support for containers
- 📡 Use Redis for session/token management
- 📃 Swagger API documentation

---

## 🙌 Author

Made with ❤️ by **ankit**  
Feel free to connect for suggestions or collaboration!

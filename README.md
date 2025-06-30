
# 🚗 RideXpress - Ride Booking Microservices System

RideXpress is a fully containerized, production-ready ride-booking backend inspired by Uber. Built using **Node.js**, **Express**, **MongoDB**, **PostgreSQL**, **Redis**, **RabbitMQ**, **SendGrid**, and **Docker**, this system follows a **Microservices Architecture** ensuring scalability, resilience, and decoupled services.

---

## 🧩 Services & Ports

| Service             | Port  | Description                              |
|---------------------|-------|------------------------------------------|
| API Gateway         | 5000  | Entry point for all requests             |
| Auth Service        | 5001  | User login & JWT auth                    |
| User Service        | 5002  | User profile & data                      |
| Captain Service     | 5003  | Driver onboarding & status               |
| Ride Service        | 5004  | Booking, matching & ride history         |
| Notification Service| 5005  | Handles emails like OTP, welcome, etc.   |

---

## ⚙️ Tech Stack

- **Node.js + Express** – Backend framework
- **MongoDB** – NoSQL database (flexible schema)
- **PostgreSQL** – Relational database (structured data)
- **Redis** – Caching, sessions, and token management
- **RabbitMQ** – Message broker for inter-service communication 🐇
- **SendGrid** – Cloud email service for OTP & welcome emails 📧
- **Docker** – For containerizing and orchestration 🐳

---

## 🧠 Architecture Overview

Each service is independently containerized and communicates via:
- **Synchronous REST APIs** (API Gateway → Service)
- **Asynchronous Events** using **RabbitMQ**

```
              ┌────────────┐
              │  Client    │
              └────┬───────┘
                   ↓
         ┌────────────────────┐
         │   API Gateway (5000) │
         └────┬──────────────┘
              ↓
 ┌────────────┬───────────────┬───────────────┬──────────────┐
 │ Auth (5001)│ User (5002)   │ Captain (5003)│ Ride (5004)  │
 └────┬───────┴───────────────┴───────────────┴──────┬───────┘
      ↓                                               ↓
        →→→→→→  RabbitMQ (async)  →→→→→→→→→→→→→→→→→→→→
                      ↓
             Notification (5005)
```

---

## ✉️ Email System (Notification Service)

Email sending is **decoupled** and handled in a dedicated **Notification Service** using **SendGrid**.

**Supported Emails:**
- ✅ OTP verification (signup/login)
- ✅ Welcome email after registration
- ✅ Token verification / reset password

**Template Engine:**
- HTML templates with dynamic placeholders (`{{fullName}}`, `{{otp}}`, etc.)
- Image attachments using Content-ID (`cid`) embedding

---

## 🔁 Inter-Service Messaging

### ✅ **Synchronous (REST)**
- API Gateway calls Auth, User, Ride, etc. via HTTP

### ✅ **Asynchronous (RabbitMQ)**
- `auth_exchange`, `captain_exchange` → notification events
- `ride_exchange` → ride updates

```js
// Example binding in Notification Service:
await channel.bindQueue(queue, "auth_exchange", "verify.signup.mail");
await channel.bindQueue(queue, "ride_exchange", "ride.accepted");
```

---

## 📦 Dockerized Setup

```bash
docker-compose up --build
```

---

## ✨ Features

- 🔐 JWT-based Authentication
- 👥 Role-based (user/captain) authorization
- 📬 Email system with SendGrid
- 📡 Real-time-ready design
- 🧵 RabbitMQ for async task queueing
- 🧠 MongoDB + PostgreSQL per use case

---

## 📂 Folder Structure (Example)

```
RideXpress/
│
├── gateway/
├── auth-service/
├── user-service/
├── captain-service/
├── ride-service/
├── notification-service/
├── docker-compose.yml
├── README.md
```

---

## 🧪 Upcoming Enhancements

- 🔄 WebSocket support for real-time updates
- 💸 Razorpay/Stripe payment integration
- 📊 Admin dashboards with analytics
- 📱 Notification system via SMS/Push

---

## 🛠️ Developer Tips

- Use `.env` files for secrets (e.g., SendGrid API keys)
- Use `RabbitMQ Management UI` on `http://localhost:15672/` (guest/guest)
- Run each service in dev with `nodemon` or containerized via Docker

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License

This project is licensed under the GNU License.

---

> Made with ❤️ by **Ankit (aka Kumar)** – learning by building real-world systems.

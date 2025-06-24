# 🚗 RideXpress - Ride Booking Microservices System

RideXpress is a fully containerized, production-ready ride-booking backend inspired by Uber. Built using **Node.js**, **Express**, **MongoDB**, **PostgreSQL**, **Redis**, **RabbitMQ**, and **Docker**, this system follows a **Microservices Architecture** ensuring scalability, resilience, and decoupled services.

---

## 🧩 Services & Ports

| Service        | Port  | Description                    |
|----------------|-------|--------------------------------|
| API Gateway    | 5000  | Entry point for all requests   |
| Auth Service   | 5001  | User login & JWT auth          |
| User Service   | 5002  | User profile & data            |
| Captain Service| 5003  | Driver onboarding & status     |
| Ride Service   | 5004  | Booking, matching & history    |

---

## ⚙️ Tech Stack

- **Node.js + Express** – Backend framework
- **MongoDB** – NoSQL database (for flexible services)
- **PostgreSQL** – Relational DB (for structured data)
- **Redis** – In-memory caching & session management
- **RabbitMQ** – Messaging system for async communication 🐇
- **Docker** – Containerization of all services 🐳

---

## 📦 Microservices Architecture

Each service is independently containerized and communicates via **REST APIs** and **RabbitMQ events**.

```
[Client] --> [API Gateway (5000)] --> [Service (Auth/User/Ride/etc)]
```

- Services have isolated DBs (Mongo/Postgres depending on the use case).
- All internal communication between services can be event-driven using RabbitMQ.

---

## 🐳 Dockerized Setup

Use Docker Compose to bring up the full system:

```bash
docker-compose up --build
```

- Make sure Docker & Docker Compose are installed.
- Environment variables are set in `.env` files for each service.

---

## 🛡️ Security

- JWT-based Authentication system
- Role-based access for **users** and **captains**
- Rate-limiting and helmet for basic security

---

## 📂 Folder Structure (Sample)

```
RideXpress/
│
├── gateway/
├── auth-service/
├── user-service/
├── captain-service/
├── ride-service/
├── docker-compose.yml
├── README.md
```

---

## ✨ Features

- 🧑‍💼 User SignUp / Login / JWT Tokens
- 🚖 Captain availability & live tracking
- 📍 Ride booking, cancellation, and history
- 📨 Event-driven communication with RabbitMQ
- 💾 Mongo + Postgres dual DB setup
- ♻️ Redis integration for caching/session

---

## 🧪 Upcoming Enhancements

- 🚦 Real-time location updates via WebSocket
- 💳 Payment integration (Stripe/Razorpay)
- 📊 Admin panel for ride & user analytics

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is licensed under the GNU License.

---

> Made with ❤️ by ankit

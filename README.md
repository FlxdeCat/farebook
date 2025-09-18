# Farebook

> A compact, practical social network clone — built for learning, speed, and experimentation.

Farebook is a full‑stack social app inspired by classic social platforms. It focuses on core primitives: user auth, posts, likes, comments, and friend connections, assembled with a clean, modern stack designed to teach practical tradeoffs for performance, security, and developer experience.

---

## Tech snapshot

* **Backend:** Go (GraphQL) — fast, typed, simple concurrency model
* **Frontend:** React + TypeScript + Vite — snappy DX and small bundles
* **Database:** PostgreSQL — reliable relational storage for social graph
* **Cache / Sessions:** Redis — caching and lightweight session handling
* **Auth:** JWT + salted password hashing
* **File storage:** Firebase Storage (used by frontend for media uploads)

---

## Key features

* User registration, login and JWT-based authentication
* Create, read, update, delete (CRUD) posts with text + media
* Likes and threaded comments
* Friend connections (follow / friend model)
* Redis-backed caching and session helpers for fast responses
* Minimal, opinionated architecture that’s easy to extend

---

## Repository layout

```
/ (repo root)
├─ backend/        # Go server, GraphQL handlers, DB code
│  ├─ database
│  ├─ graph
│  ├─ helper
│  └─ service
├─ frontend/       # React + TypeScript + Vite app
│  ├─ public
│  └─ src
│     ├─ assets
│     ├─ component
│     ├─ firebase
│     ├─ lib
│     └─ pages
└─ Redis-x64-5.0.14.1/          # bundled Redis x64 binaries (Redis 5.0.14.1)
```

---

## Quick start

### 1) Backend (Go)

1. Copy `env.example` to `.env` and fill values (DB connection, JWT secret, Redis address, etc.)
2. Start the server:

```
cd backend
# make sure your Postgres & Redis are reachable
go run server.go
```

* The GraphQL playground will be available on **[http://localhost:8080](http://localhost:8080)** by default.
* Database: PostgreSQL (configure connection string in `.env`).

### 2) Frontend (React + Vite)

1. Create a Firebase Storage app and grab the client config
2. Copy your Firebase config into `frontend/src/firebase/config.ts`
3. Install and run:

```
cd frontend
npm install
npm run dev
```

* The frontend will run on Vite’s default dev port (typically **[http://localhost:5173](http://localhost:5173)**).
* Firebase is used only for file/media uploads in the client.

### 3) Redis (Windows bundle included)

This repo includes a small Redis x64 bundle (v5.0.14.1). To run:

```
cd Redis-x64-5.0.14.1
redis-server.exe
```

---

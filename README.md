# JobFix — Server (Node.js + Express + MongoDB)

[![Node](https://img.shields.io/badge/Node-22-5fa04e?logo=node.js&logoColor=fff)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-black?logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47a248?logo=mongodb&logoColor=fff)](https://www.mongodb.com/atlas)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-46e3b7?logo=render&logoColor=fff)](https://render.com/)

> Secure REST API for authentication, user profiles, job management, and analytics.

**Base URL:** https://jobfix-server.onrender.com  
**Healthcheck:** `/health` → `ok`

## Features

- 🔐 JWT auth with HttpOnly cookies
- 👤 User profile + avatar upload (Cloudinary, in-memory buffering via Multer)
- 💼 Jobs CRUD + filters
- 📊 App stats (monthly counts, status breakdowns)
- 🧱 Security middlewares: CORS (allow-list), Helmet, cookie parsing
- 🪵 Dev logging via `morgan` (dev only)

## Tech Stack

- **Node.js 22**, **Express**
- **MongoDB + Mongoose**
- **Cloudinary** (image storage)
- **Multer (memoryStorage)** for safe upload buffers
- **dotenv**, **helmet**, **cookie-parser**, **morgan**

## Environment Variables

Create a `.env` file in the repo root:

```env
# Core
NODE_ENV=production
PORT=5100
CLIENT_URL=https://jobfix.onrender.com

# Database
DATABASE_URI=<your_mongodb_atlas_connection_string>

# Auth
JWT_SECRET=<your_long_random_secret>
JWT_EXPIRES_IN=5d
DEMO_EMAIL=test@test.com

# Cloudinary
CLOUD_NAME=<cloud_name>
CLOUD_API_KEY=<api_key>
CLOUD_API_SECRET=<api_secret>

```

## API Overview

```
# Auth /api/v1/auth
POST /signup – register user
POST /login – login (sets HttpOnly cookie token)
POST /logout – clear cookie

# Users /api/v1/users (protected)
GET /current-user – return current user
PATCH /update-user – update profile (supports avatar file)
GET /admin/app-stats – admin-only platform stats

#Jobs /api/v1/jobs (protected)
GET / – list jobs (search/filter/sort/paginate)
POST / – create job
GET /:id – get one job
PATCH /:id – update job
DELETE /:id – delete job
GET /stats – charts data
```

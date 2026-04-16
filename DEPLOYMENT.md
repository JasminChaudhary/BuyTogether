# BuyTogether Deployment Guide

## Recommended (Most Stable): Deploy both services on Render

Use two Render services:
- `backend` as a **Web Service**
- `frontend` as a **Static Site**

### 1) Backend (Render Web Service)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Required environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `STRIPE_SECRET_KEY`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `CLIENT_URL` = your frontend URL (for example `https://your-frontend.onrender.com`)

After deploy, verify:
- `https://<your-backend>.onrender.com/api/health` returns `{"status":"ok"}`

### 2) Frontend (Render Static Site)
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Required environment variables:
  - `VITE_API_URL` = `https://<your-backend>.onrender.com/api`
  - `VITE_STRIPE_PUBLISHABLE_KEY`

### 3) SPA Routing (important for "Page Not Found")
Add redirect rule in Render Static Site:
- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

This is required for React Router deep links like `/user/dashboard`.

---

## Frontend on Vercel + Backend on Render (also valid)

If you keep this split setup:
- Deploy backend on Render as above.
- Deploy frontend on Vercel with root directory set to `frontend`.
- In Vercel Project Settings > Environment Variables:
  - `VITE_API_URL` = `https://<your-backend>.onrender.com/api`
  - `VITE_STRIPE_PUBLISHABLE_KEY`

Your `frontend/vercel.json` already handles SPA route rewrites.

---

## Can everything run on only Vercel?

Possible, but not recommended for current code:
- Current backend is a long-running Node/Express + Socket.IO server.
- Vercel is serverless-first, so WebSocket and persistent server behavior require architecture changes.

For your current project structure, Render is the easier and safer one-platform choice.

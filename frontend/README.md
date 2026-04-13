# Photocopy Shop Frontend

Frontend application for the Sahana Photocopy Shop. This project includes the public storefront and a role-based admin dashboard for managing products, orders, print requests, users, and profit tracking.

## Table of Contents

- [About](#about)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Route Map](#route-map)
- [API Expectations](#api-expectations)
- [Business Rules and Limits](#business-rules-and-limits)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [Quality Status](#quality-status)

## About

The frontend is built with React + Vite and communicates with a backend REST API over HTTP.

It serves three user roles:

- Guests: browse products and register an account.
- Customers: place stationery orders, submit print requests, and track their own activity.
- Admins: monitor operational health and manage catalog, orders, print requests, users, and profit records.

## Core Features

### Customer Experience

- Authentication (register, login, protected pages)
- Product catalog browsing with filters and search
- Shopping cart management with quantity updates
- Checkout and order creation flow
- Print request submission with file upload and job options
- AI-assisted print option suggestions
- Personal order history and print request tracking

### Admin Experience

- Dashboard insights (orders, print requests, revenue, stock)
- Product CRUD and stock visibility controls
- Order status lifecycle updates
- Print request status lifecycle updates
- User management with role updates and deletion
- Profit entry management with summary metrics

## Technology Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS
- Axios
- Framer Motion
- Recharts
- React Hot Toast
- Vitest
- ESLint

## Project Structure

```text
src/
  components/     Reusable UI + admin tables/forms/layout
  context/        Global auth/cart state management
  pages/          Customer and admin route pages
  services/       API client wrappers and service tests
  assets/         Static frontend assets
  utils/          Helper utilities
public/           Static public files
```

## Requirements

- Node.js 20+
- npm 10+
- Running backend API compatible with the endpoints listed below

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```env
VITE_API_URL=http://localhost:5000
```

If your team maintains an `.env.example`, you can copy it to `.env` and update values as needed.

3. Start development server:

```bash
npm run dev
```

4. Open the URL printed by Vite (typically `http://localhost:5173`).

5. Ensure your backend is running and reachable at the same origin defined in `VITE_API_URL`.

## Environment Variables

| Variable       | Required | Default                 | Description                                                      |
| -------------- | -------- | ----------------------- | ---------------------------------------------------------------- |
| `VITE_API_URL` | Yes      | `http://localhost:5000` | Backend service origin. The app calls `${VITE_API_URL}/api/...`. |

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production assets into `dist/`
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks
- `npm run test` - Run Vitest suite
- `npm run check` - Run lint + test + build sequentially

## Route Map

Public and customer routes:

- `/` - Home page
- `/products` - Product catalog
- `/login` - Login page
- `/register` - Registration page
- `/cart` - Shopping cart (customer only)
- `/print-request` - New print request submission (customer only)
- `/my-orders` - Customer order history (customer only)
- `/my-print-requests` - Customer print request history (customer only)

Admin routes:

- `/admin/dashboard` - Dashboard overview
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/print-requests` - Print request management
- `/admin/users` - User management
- `/admin/profit-management` - Profit management

## API Expectations

The frontend expects these backend route groups:

- `/api/auth`
- `/api/products`
- `/api/orders`
- `/api/print-requests`
- `/api/users`
- `/api/dashboard`
- `/api/profit`
- `/api/ai`

The API client automatically attaches an auth token from `localStorage` when present.

Common frontend API calls include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/status` (admin)
- `POST /api/print-requests`
- `GET /api/print-requests/my-requests`
- `GET /api/print-requests` (admin)
- `PUT /api/print-requests/:id/status` (admin)
- `DELETE /api/print-requests/:id` (admin)
- `GET /api/users` (admin)
- `PUT /api/users/:id` (admin)
- `DELETE /api/users/:id` (admin)
- `GET /api/dashboard/summary` (admin)
- `GET /api/dashboard/low-stock` (admin)
- `GET /api/profit/summary` (admin)
- `POST /api/profit/entries` (admin)
- `PUT /api/profit/entries/:id` (admin)
- `DELETE /api/profit/entries/:id` (admin)
- `POST /api/ai/print-assist`

## Business Rules and Limits

- Session/auth state is persisted in `localStorage`.
- Auth keys used by the app: `token` and `user`.
- Cart state is persisted in `localStorage`.
- Cart key used by the app: `cartItems`.
- Accepted print upload file types: `PDF`, `DOC`, `DOCX`, `PNG`, `JPG`, `JPEG`.
- Maximum print upload size: 10 MB.
- Customer-only pages are guarded by route protection.
- Admin pages are under `/admin/*` and require admin role.

## Deployment Notes

- Run `npm run build` before deployment to generate `dist/`.
- Deploy static files from `dist/` to your hosting provider.
- Ensure `VITE_API_URL` points to the correct backend for each environment.

## Troubleshooting

- App cannot reach API:
  Set `VITE_API_URL` correctly and verify the backend is running.
- Unauthorized requests:
  Check that login succeeded and auth token exists in `localStorage`.
- CORS issues in development:
  Confirm backend CORS allows your frontend origin (for example `http://localhost:5173`).
- Upload errors on print requests:
  Validate file type and size against accepted limits (10 MB max).

## Quality Status

Current expected health checks:

- `npm run lint`
- `npm run test`
- `npm run build`

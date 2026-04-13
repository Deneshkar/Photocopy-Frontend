# Photocopy Shop Frontend

Frontend application for the Sahana Photocopy Shop. This project includes the public storefront and a role-based admin dashboard for managing products, orders, print requests, and users.

## Table of Contents

- [About](#about)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Expectations](#api-expectations)
- [Business Rules and Limits](#business-rules-and-limits)
- [Deployment Notes](#deployment-notes)
- [Quality Status](#quality-status)

## About

The frontend is built with React + Vite and communicates with a backend REST API over HTTP.

It serves three user roles:

- Guests: browse products and register an account.
- Customers: place stationery orders, submit print requests, and track their own activity.
- Admins: monitor operational health and manage catalog, orders, print requests, and users.

## Core Features

### Customer Experience

- Authentication (register, login, protected pages)
- Product catalog browsing with filters and search
- Shopping cart management with quantity updates
- Checkout and order creation flow
- Print request submission with file upload and job options
- Personal order history and print request tracking

### Admin Experience

- Dashboard insights (orders, print requests, revenue, stock)
- Product CRUD and stock visibility controls
- Order status lifecycle updates
- Print request status lifecycle updates
- User management with role updates and deletion

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

3. Start development server:

```bash
npm run dev
```

4. Open the URL printed by Vite (typically `http://localhost:5173`).

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | Yes | `http://localhost:5000` | Backend service origin. The app calls `${VITE_API_URL}/api/...`. |

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production assets into `dist/`
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks
- `npm run test` - Run Vitest suite
- `npm run check` - Run lint + test + build sequentially

## API Expectations

The frontend expects these backend route groups:

- `/api/auth`
- `/api/products`
- `/api/orders`
- `/api/print-requests`
- `/api/users`
- `/api/dashboard`

The API client automatically attaches an auth token from `localStorage` when present.

## Business Rules and Limits

- Session/auth state is persisted in `localStorage`.
- Cart state is persisted in `localStorage`.
- Accepted print upload file types: `PDF`, `DOC`, `DOCX`, `PNG`, `JPG`, `JPEG`.
- Maximum print upload size: 10 MB.
- Admin pages are under `/admin/*` and are hidden from public navigation.

## Deployment Notes

- Run `npm run build` before deployment to generate `dist/`.
- Deploy static files from `dist/` to your hosting provider.
- Ensure `VITE_API_URL` points to the correct backend for each environment.

## Quality Status

Current expected health checks:

- `npm run lint`
- `npm run test`
- `npm run build`

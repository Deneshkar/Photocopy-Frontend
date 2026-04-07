# Photocopy Shop Frontend

Frontend application for the Sahana Photocopy shop. This project provides the customer storefront and the admin dashboard for stationery sales, print requests, and order management.

## Overview

The app is built with React and Vite and talks to a backend API over HTTP. It supports three main user experiences:

- Guests can browse the catalog and create an account.
- Customers can place stationery orders, submit print requests, and track their own activity.
- Admins can manage products, orders, print requests, users, and dashboard reporting.

## Features

### Customer Features

- User registration and login
- Product listing with search, category, and availability filters
- Shopping cart with quantity controls and checkout form
- Print request submission with file upload, paper size, print type, and copy settings
- Personal order history and print request tracking

### Admin Features

- Dashboard summary cards and charts for orders, print requests, revenue, and stock health
- Product create, update, delete, and filter flows
- Order status management
- Print request status management
- User listing, role updates, and deletion

## Tech Stack

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
  components/   Shared UI and admin tables/forms
  context/      Authentication and cart state
  pages/        Customer pages and admin pages
  services/     API client and tests
public/         Static assets
```

## API Configuration

The frontend expects a backend API and uses `VITE_API_URL` as the base origin.

Default fallback:

```env
VITE_API_URL=http://localhost:5000
```

The Axios client sends requests to `${VITE_API_URL}/api` and automatically attaches the saved auth token from `localStorage` when available.

The backend should expose endpoints for:

- `/api/auth`
- `/api/products`
- `/api/orders`
- `/api/print-requests`
- `/api/users`
- `/api/dashboard`

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A running backend API compatible with the routes above

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

### Run in Development

```bash
npm run dev
```

The Vite development server will print the local URL in the terminal.

## Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint
- `npm run test` runs Vitest
- `npm run check` runs lint, tests, and production build in sequence

## Notes

- Authentication state and cart contents are stored in `localStorage`.
- Print request uploads accept `PDF`, `DOC`, `DOCX`, `PNG`, `JPG`, and `JPEG` files up to 10 MB.
- Admin routes live under `/admin/*` and are hidden from the public navigation.

## Status

The current frontend passes:

- `npm run lint`
- `npm run test`
- `npm run build`

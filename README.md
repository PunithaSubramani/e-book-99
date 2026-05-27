# BookVerse — E-Book Store

A full-stack e-commerce application for e-books built with React, Node.js, PostgreSQL, and Tailwind CSS. Deployable on AWS ROSA (OpenShift).

---

## Screens & Features

| Screen | Features |
|--------|----------|
| **Landing Page** | Hero banner, category grid, bestsellers, new arrivals, promo banner, all books |
| **Catalogue** | Category filter, publisher filter, price range, sort, search, active filter chips |
| **Book Detail** | Book image, rating, description, qty selector, Add to Cart, Buy Now, wishlist, related books |
| **Cart** | Item list, qty controls, remove, order summary, gift points notice, recommendations |
| **Address** | Saved addresses, select/add new address, multi-step checkout indicator |
| **Payment** | Card / PayPal / Apple Pay / Google Pay / UPI, gift points redemption, order summary |
| **Confirmation** | Order ID, success animation, download CTA, order history link |
| **Orders** | Order history, Buy It Again, per-item download |
| **Wishlist** | Saved books, Add All to Cart |
| **Login / Sign Up** | Toggle form, JWT auth, 150 gift points on sign-up |

---

## Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v3, Zustand, react-hot-toast, react-icons
- **Backend**: Node.js, Express, PostgreSQL (pg), bcryptjs, jsonwebtoken, express-validator
- **Database**: PostgreSQL 15
- **Deployment**: AWS ROSA (OpenShift) via Kubernetes manifests + Docker
- **Tests**: React Testing Library + Jest (frontend), Jest + Supertest (backend)

---

## Project Structure

```
e-book/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # Navbar, BookCard, StarRating
│   │   ├── pages/          # All screen pages
│   │   ├── store/          # Zustand store
│   │   ├── data/           # Static book/category data
│   │   └── __tests__/      # React Jest tests
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # Node.js API
│   ├── src/
│   │   ├── routes/         # auth, books, cart, orders
│   │   ├── middleware/     # JWT auth
│   │   └── app.js
│   ├── db/
│   │   ├── schema.sql      # PostgreSQL schema
│   │   └── seed.sql        # Sample book data
│   ├── __tests__/          # Jest + Supertest tests
│   └── Dockerfile
├── k8s/                    # Kubernetes / ROSA manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── secrets.yaml
└── docker-compose.yml      # Local development
```

---

## Quick Start (Local)

### Option 1 — Docker Compose (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Option 2 — Manual

**Backend:**
```bash
cd backend
cp .env.example .env   # edit DATABASE_URL
npm install
# Apply schema and seed
psql $DATABASE_URL -f db/schema.sql
psql $DATABASE_URL -f db/seed.sql
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## Running Tests

**Backend (Jest + Supertest):**
```bash
cd backend
npm test
# 21 tests across auth, books, cart
```

**Frontend (React Testing Library + Jest):**
```bash
cd frontend
npm test -- --watchAll=false
# 26 tests across components and pages
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user (150 gift points) |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/books` | — | List books (filter: category, brand, tag, q, sort) |
| GET | `/api/books/:id` | — | Single book |
| GET | `/api/books/:id/related` | — | Related books by category |
| GET | `/api/cart` | ✓ | Get cart |
| POST | `/api/cart` | ✓ | Add to cart |
| PATCH | `/api/cart/:id` | ✓ | Update qty |
| DELETE | `/api/cart/:id` | ✓ | Remove item |
| DELETE | `/api/cart` | ✓ | Clear cart |
| POST | `/api/orders` | ✓ | Place order (supports gift point redemption) |
| GET | `/api/orders` | ✓ | Order history |
| GET | `/api/orders/:id` | ✓ | Single order |

---

## AWS ROSA Deployment

```bash
# Create namespace
oc apply -f k8s/namespace.yaml

# Apply secrets (update base64 values first)
oc apply -f k8s/secrets.yaml

# Deploy backend and frontend
oc apply -f k8s/backend-deployment.yaml
oc apply -f k8s/frontend-deployment.yaml

# Check status
oc get pods -n bookverse
oc get routes -n bookverse
```

Build and push images to your registry first:
```bash
docker build -t your-registry/bookverse-backend:latest ./backend
docker build -t your-registry/bookverse-frontend:latest ./frontend
docker push your-registry/bookverse-backend:latest
docker push your-registry/bookverse-frontend:latest
```

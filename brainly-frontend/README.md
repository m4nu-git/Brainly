<div align="center">

# 🧠 Brainly — Web App

**Save everything. Find anything. Share your knowledge.**

A fast, modern React web app for your second brain —
bookmark links, articles, videos, and documents with smart tag-based organization.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.x-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)

</div>

---

## ✨ Features

- 🔐 **Auth** — Sign up / sign in with persistent sessions via `localStorage`
- 📌 **Save Anything** — Bookmark YouTube videos, tweets, articles, documents, and links
- 🏷️ **Tag Manager** — Create, attach, and delete tags across all your content
- 🔍 **Search & Filter** — Filter by content type, tag, or title with live search and pagination
- 🌐 **Share Your Brain** — Generate a public URL to share your entire knowledge base — no login needed
- 🗑️ **Full CRUD** — Add, edit, and delete any saved item via clean modal flows
- 🔔 **Toast Notifications** — Instant feedback on every action via Sonner
- ⚡ **Blazing Fast** — Vite 7 with manual chunk splitting for optimal load times
- 📦 **Type-Safe End-to-End** — TypeScript + Zod validation on every form

---

## 🏗️ Project Structure

```
src/
├── app/                        # Core app wiring
│   ├── providers.tsx           # Global context providers
│   ├── router.tsx              # React Router v7 config (lazy loaded)
│   └── layouts/                # Shell layout (sidebar + outlet)
│
├── pages/                      # Route-level page components
│   ├── Dashboard.tsx           # Main content feed (protected)
│   ├── Tags.tsx                # Tag management (protected)
│   ├── SharedBrain.tsx         # Public shared brain view
│   ├── SignIn.tsx              # Login page
│   ├── SignUp.tsx              # Register page
│   └── NotFound.tsx            # 404
│
├── components/
│   ├── cards/                  # ContentCard, ContentCardSkeleton
│   ├── forms/                  # SignInForm, SignUpForm,
│   │                           # ContentForm, TagForm
│   ├── modals/                 # AddContentModal, EditContentModal,
│   │                           # AddTagModal, DeleteConfirmModal,
│   │                           # ShareBrainModal
│   ├── common/                 # ProtectedRoute, PublicRoute,
│   │                           # ErrorBoundary, EmptyState
│   └── ui/                     # button, input, textarea, label,
│                               # dialog, select, badge, skeleton,
│                               # spinner, field (Radix-based)
│
├── store/                      # Zustand global state
│   ├── useAuthStore.ts         # Auth + localStorage persistence
│   ├── useContentStore.ts      # Content list, filters, pagination
│   ├── useTagsStore.ts         # Tags CRUD
│   └── useUiStore.ts           # Modal open/close state
│
├── services/api/               # Axios client + resource modules
│   ├── client.ts               # Base URL, auth interceptor, 401 redirect
│   ├── auth.ts
│   ├── content.ts
│   ├── tags.ts
│   └── brain.ts
│
├── hooks/                      # Custom React hooks
├── schemas/                    # Zod validation schemas (auth, content, tags)
├── types/                      # TypeScript interfaces
├── constants/                  # Route paths, content type config
└── utils/                      # Date formatters, helpers
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- The [Brainly backend](../backend/README.md) running on port `3000`

### Installation

```bash
# Enter the frontend directory
cd brainly/brainly-frontend

# Install dependencies
npm install
```

### Environment

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Run

```bash
# Development server (with HMR)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

The app runs at `http://localhost:5173`

---

## 🛠️ Tech Stack

| Category | Library |
|----------|---------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Routing | React Router v7 (lazy loaded) |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 4 |
| UI Primitives | Radix UI (Dialog, Select, Label, Dropdown) |
| Component Variants | Class Variance Authority + clsx + tailwind-merge |
| HTTP Client | Axios 1.18 with interceptors |
| Forms | React Hook Form 7 + Zod 4 |
| Icons | Lucide React |
| Notifications | Sonner |

---

## 📡 Pages & Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | 🔒 Protected | Dashboard — content feed with filters |
| `/tags` | 🔒 Protected | Tag manager |
| `/signin` | Public | Sign in page |
| `/signup` | Public | Register page |
| `/brain/:shareLink` | Public | Shared brain (read-only) |
| `*` | Public | 404 Not Found |

Protected routes redirect to `/signin` when unauthenticated. Authenticated users are redirected away from `/signin` and `/signup` automatically.

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build
# Output in /dist — deploy to Vercel, Netlify, or any static host

# Lint
npm run lint
```

**Vite chunks** are manually split for optimal caching:
- `vendor-react` — React core
- `vendor-ui` — Radix UI
- `vendor-utils` — Zustand, Axios, React Hook Form, Zod

---

## 📄 License

MIT © [Your Name]

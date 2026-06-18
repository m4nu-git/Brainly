<div align="center">

# 🧠 Brainly App

**Your second brain — in your pocket.**

A beautifully crafted cross-platform mobile app to save, organize, and share everything you discover online.
Built with Expo, React Native, and a clean layered architecture.

[![Expo](https://img.shields.io/badge/Expo-55.x-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5.x-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)

</div>

---

## ✨ Features

- 🔐 **Secure Auth** — Sign up / sign in with tokens stored safely via `expo-secure-store`
- 📌 **Save Anything** — YouTube, Twitter, articles, documents, and links — all in one feed
- 🏷️ **Tag System** — Create personal tags and attach them to any content item
- 🔍 **Search & Filter** — Find saved content instantly by title, type, or tag
- 🌐 **Share Your Brain** — One tap generates a public link anyone can view — no login required
- 🎨 **Light & Dark Mode** — Automatic system-aware theming throughout the app
- ⚡ **Smooth Animations** — Fluid transitions and sheet gestures via Reanimated 4
- 📱 **Truly Cross-Platform** — iOS · Android · Web from a single codebase

---

## 🏗️ Project Structure

```
src/
├── app/                          # Expo Router — file-based routing
│   ├── (auth)/                   # Sign In, Sign Up screens
│   ├── (app)/                    # Protected tab screens
│   │   ├── index.tsx             # Brain feed (home)
│   │   ├── tags.tsx              # Tags manager
│   │   └── settings.tsx          # Settings & logout
│   └── brain/[shareLink].tsx     # Public shared brain (no auth)
│
├── components/
│   ├── cards/                    # ContentCard, ContentCardSkeleton
│   ├── sheets/                   # AddContentSheet, EditContentSheet
│   │                             # AddTagSheet, ShareBrainSheet
│   ├── common/                   # EmptyState, ErrorState, FilterBar
│   └── ui/                       # Button, Input, Badge, Spinner
│                                 # Skeleton, Collapsible, Field
│
├── store/                        # Zustand global state (4 stores)
│   ├── authStore.ts
│   ├── contentStore.ts
│   ├── tagsStore.ts
│   └── uiStore.ts
│
├── services/api/                 # Axios client + resource modules
│   ├── client.ts                 # Auth interceptors, token injection
│   ├── auth.ts
│   ├── content.ts
│   ├── tags.ts
│   └── brain.ts
│
├── hooks/                        # useTheme, useColorScheme,
│                                 # useDebounce, useRefreshOnFocus
├── schemas/                      # Zod form validation schemas
├── constants/                    # Colors, content types, theme tokens
├── types/                        # TypeScript interfaces & enums
└── utils/                        # Date formatters, helpers
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **Expo Go** app on your phone — [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- OR an iOS Simulator / Android Emulator

### Installation

```bash
# Navigate into the app directory
cd brainly/brainly-app

# Install dependencies
npm install
```

### Environment

Create a `.env` file in this directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

> When running on a **physical device**, replace `localhost` with your
> machine's local IP address (e.g. `http://192.168.1.5:3000/api/v1`).

Make sure the [backend](../backend/README.md) is running first.

### Run

```bash
# Start Expo dev server
npx expo start

# Then press:
#   i  →  iOS Simulator
#   a  →  Android Emulator
#   w  →  Browser (web)
# Or scan the QR code with Expo Go on your phone
```

---

## 🛠️ Tech Stack

| Category | Library |
|----------|---------|
| Framework | Expo 55 · React Native 0.83 · React 19 |
| Language | TypeScript 5 |
| Routing | Expo Router 4 (file-based) |
| State Management | Zustand 5 |
| HTTP Client | Axios 1.18 with interceptors |
| Animations | React Native Reanimated 4 |
| Bottom Sheets | `@gorhom/bottom-sheet` 5 |
| Navigation | Expo Router + `@react-navigation/bottom-tabs` |
| Forms | React Hook Form 7 + Zod 4 |
| Icons | Lucide React Native |
| Secure Storage | `expo-secure-store` |
| Toasts | React Native Toast Message |

---

## 🎨 Design System

The app uses a hand-crafted design system with full light/dark support.

**Core palette:**

| Token | Color | Hex |
|-------|-------|-----|
| Primary | ![#5046E4](https://placehold.co/12x12/5046E4/5046E4.png) | `#5046E4` |
| Background | ![#F1F5F9](https://placehold.co/12x12/F1F5F9/F1F5F9.png) | `#F1F5F9` |
| Surface | ![#FFFFFF](https://placehold.co/12x12/FFFFFF/FFFFFF.png) | `#FFFFFF` |
| Text | ![#0F172A](https://placehold.co/12x12/0F172A/0F172A.png) | `#0F172A` |
| Muted | ![#64748B](https://placehold.co/12x12/64748B/64748B.png) | `#64748B` |
| Danger | ![#EF4444](https://placehold.co/12x12/EF4444/EF4444.png) | `#EF4444` |
| Success | ![#22C55E](https://placehold.co/12x12/22C55E/22C55E.png) | `#22C55E` |

**Content type colors:**

| Type | Color |
|------|-------|
| YouTube | `#EF4444` |
| Twitter | `#3B82F6` |
| Article | `#22C55E` |
| Document | `#F59E0B` |
| Link | `#8B5CF6` |

---

## 📦 Build

```bash
# Create a production build with EAS
npx eas build --platform android
npx eas build --platform ios

# Or export for web
npx expo export --platform web
```

---

## 📄 License

MIT © [Your Name]

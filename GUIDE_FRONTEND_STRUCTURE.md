# Frontend Structure Guide

This document explains the organization and architecture of the frontend application. Following this structure ensures consistency and maintainability across the codebase.

## 📂 Folder Overview

The frontend follows a feature-based architecture combined with common shared layers.

### `/app`

Contains the core application setup:

- `routes.tsx`: Defines the application routing.
- `providers.tsx`: Wraps the app with necessary contexts (Auth, Theme, etc.).
- `App.tsx`: The root component.

### `/features`

The heart of the application logic. Each folder represents a domain or feature:

- `/auth`: Contains components, hooks, and logic specific to authentication.
- _Structure inside a feature:_
  - `/components`: UI elements used only within this feature.
  - `/hooks`: Custom hooks specific to this feature.
  - `/types`: TypeScript definitions for this feature.

### `/components`

Shared, reusable UI components that are NOT tied to a specific feature (e.g., Buttons, Inputs, Modals, Cards).

### `/services`

Handles external communications:

- `axios.ts`: Axios configuration and interceptors.
- `auth.service.ts`: API call definitions for the auth feature.

### `/hooks`

Global, reusable custom React hooks (e.g., `useLocalStorage`, `useWindowSize`).

### `/store`

Global state management (e.g., Redux slices, Zustand stores).

### `/utils`

Pure utility functions, formatters, and global constants.

### `/styles`

Global CSS files, design tokens, and theme configurations.

### `/assets`

Static files such as images, icons, and fonts.

---

## 🛠 Coding Patterns

### 1. Component Responsibility

- **Presentational Components**: (in `/components`) Should be stateless and focus on UI display.
- **Feature Components**: (in `/features`) Can handle side effects and data fetching.

### 2. Service Layer

Always keep API logic in `/services`. Avoid using `fetch` or `axios` directly inside components. Use hooks that call services instead.

### 3. Feature-First

Before adding a new file, ask if it belongs to a specific feature. If so, put it inside `/features/[feature-name]`. If it's truly generic, use the global folders.

### 4. Naming Convention

- **Components**: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- **Files/Hooks**: `kebab-case.ts` (e.g., `use-auth.ts`)
- **Functions**: `camelCase` (e.g., `formatCurrency`)

---

## 🚀 Benefit of this Structure

This structure reduces cognitive load by keeping related code together (Features) while providing clear locations for reusable code (Global folders). It makes the project easy to scale and collaborate on.

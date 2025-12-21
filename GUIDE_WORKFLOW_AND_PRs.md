# Development Guide

Welcome to the project! This document outlines the best practices and workflows for developing, contributing, and maintaining this project.

## 🏗 Project Architecture

This is a monorepo containing both the backend and frontend:

- `/backend`: NestJS application (Node.js framework).
- `/frontend`: React application built with TypeScript and Vite.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Backend Setup

1. `cd backend`
2. `npm install`
3. `npm run start:dev` (starts in watch mode)

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🛠 Git Workflow Commands

Here are the common commands you'll use during development:

### 1. Start a New Feature

Always ensure your `dev` branch is up to date before starting.

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### 2. Save Your Changes

Commit frequently with clear messages.

```bash
git add .
git commit -m "feat(ui): add new search bar to footer"
```

### 3. Keep Your Branch Updated

If `dev` has changed, sync your feature branch.

```bash
git checkout dev
git pull origin dev
git checkout feature/your-feature-name
git merge dev
```

### 4. Share Your Work

Push your branch to the remote repository.

```bash
git push origin feature/your-feature-name
```

---

## 🌿 Branching Strategy

We follow a feature-branching workflow.

- **`main`**: The production-ready branch.
- **`dev`**: The primary development branch. All feature branches should be created from and merged into this branch.
- **Feature Branches**: Create a new branch for every feature, bug fix, or improvement.
  - Naming Convention: `feature/short-description` or `bugfix/short-description`.

---

## ✍️ Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) to keep our history clean and readable.

**Format**: `<type>(<scope>): <description>`

**Types**:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

---

## 🔄 Pull Request Process

To maintain high code quality, all changes must go through a Pull Request (PR) review.

### 1. Create a PR

- **Title**: Use a concise title that summarizes the change.
- **Description**: Explain _what_ was changed and _why_. Include screenshots or Loom videos for UI changes.
- **Task List**: Break down the PR into smaller, checkable tasks.

### 2. Best Practices for PRs

- **Keep it Small**: Smaller PRs are easier to review and less likely to introduce bugs.
- **Self-Review**: Review your own code before asking others.
- **Address Feedback**: Be open to suggestions and discuss alternatives.
- **Maintainer Approval**: At least one approval from a maintainer is required before merging.

### 3. Merging

- Once approved and all checks pass, use **"Squash and Merge"** to keep the `dev` branch history clean.

---

## 🛠 Coding Standards

### Linting & Formatting

- **Backend**: Uses ESLint and Prettier (Configured in `/backend`).
- **Frontend**: Uses ESLint and Prettier (Configured in `/frontend`).
- **Run Linting**: `npm run lint` in the respective directory.

### Best Practices

- **TypeScript**: Use strong typing; avoid `any` wherever possible.
- **Components**: Keep React components small and focused on a single responsibility.
- **Security**: Never commit secrets or `.env` files.

---

## 🧪 Testing

Always ensure your changes don't break existing functionality.

- Backend: `npm run test`
- Frontend: `npm run test` (if applicable)

---

Happy Coding! 🚀

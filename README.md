# HNG Stage3 Habit Tracker PWA

## Project Overview

This is a mobile-first Habit Tracker Progressive Web App (PWA) built with Next.js, TypeScript, and Tailwind CSS.

The application allows users to sign up, log in, and manage daily habits by creating, editing, completing, and deleting them. Habit progress is tracked through a streak system, and all data is persisted locally using the browser's localStorage, ensuring that user data remains available even after page reloads.

The app is also installable as a PWA and supports basic offline functionality through service worker caching.

---

## Features

- User authentication (Signup and Login)
- Create, edit, complete, and delete habits
- Streak tracking based on daily completion
- Local data persistence using localStorage
- Installable as a Progressive Web App (PWA)
- Responsive mobile-first design
- Fully tested with unit, integration, and E2E tests

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Lucide React Icons
- LocalStorage
- Playwright (E2E Testing)
- Vitest (Unit & Integration Testing)

---

## Project Structure

```text
hng-stage-3-habit-tracker-pwa
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitList.tsx
│   │   └── shared/
│   │       ├── Modal.tsx
│   │       ├── ProtectedRoute.tsx
│   │       ├── ServiceWorkerRegister.tsx
│   │       └── SplashScreen.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── habits.ts
│   │   ├── slug.ts
│   │   ├── storage.ts
│   │   ├── streaks.ts
│   │   └── validators.ts
│   └── types/
│       ├── auth.ts
│       └── habit.ts
├── tests/
│   ├── e2e/
│   │   └── app.spec.ts
│   ├── integration/
│   │   ├── auth-flow.test.tsx
│   │   └── habit-form.test.tsx
│   ├── unit/
│   │   ├── habits.test.ts
│   │   ├── slug.test.ts
│   │   ├── streaks.test.ts
│   │   └── validators.test.ts
│   └── setup.ts
├── eslint.config.js
├── next-env.d.ts
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vitest.config.ts
```

---

## Setup Instructions

Make sure you have Node.js (v18 or later) installed.

1. Clone the repository:

```bash
git clone https://github.com/iibrahimx/hng-stage-3-habit-tracker-pwa.git
```

2. Navigate into the project folder:

```bash
cd hng-stage-3-habit-tracker-pwa
```

3. Install dependencies:

```bash
npm install
```

---

## Run Instructions

1. Start the development server:

```bash
npm run dev
```

2. The app will be available at:

```text
http://localhost:3000
```

3. Build for production:

```bash
npm run build
```

4. Start production server:

```bash
npm run start
```

---

## Test Instructions

This project includes unit, integration, and end-to-end (E2E) tests to ensure application reliability and correctness.

### Run all tests

```bash
npm run test
```

### Unit tests

Unit tests validate individual utility functions such as slug generation, validation logic, and streak calculations.

```bash
npm run test:unit
```

### Integration tests

Integration tests verify how different parts of the application work together, including authentication flow and habit management features.

```bash
npm run test:integration
```

### End-to-End (E2E) Tests

E2E tests simulate real user interactions in a browser environment, covering the full application flow from signup to habit management and logout.

```bash
npm run test:e2e
```

---

## Local Persistence Structure

This application uses the browser's `localStorage` to persist user data and maintain state across page reloads. This approach was chosen because the project does not include a backend, and all data must be stored locally on the client.

### Storage Keys

The following keys are used:

- `habit-tracker-users`  
  Stores all registered users in the application. Each user object contains:
  - `id`: unique identifier for the user
  - `email`: user's email address
  - `password`: user's password (stored locally for this project)
  - `createdAt`: timestamp of account creation

- `habit-tracker-session`  
   Stores the currently logged-in user's session. This allows the app to maintain authentication state after a page refresh. The session object contains:
  - `userId`: ID of the logged-in user
  - `email`: email of the logged-in user
    > (Note: Password is not stored in the session for basic security reasons.)

- `habit-tracker-habits`  
  Stores all habits created by users. Each habit object contains:
  - `id`: unique identifier for the habit
  - `userId`: ID of the user who created the habit
  - `name`: habit name
  - `description`: habit description
  - `frequency`: habit frequency (e.g., daily)
  - `createdAt`: timestamp of creation
  - `completions`: array of completion dates used to calculate streaks

### How It Works

- When a user signs up, their details are added to `habit-tracker-users`.
- When a user logs in, a session is created and stored in `habit-tracker-session`.
- When a habit is created, edited, completed, or deleted, the `habit-tracker-habits` key is updated.
- On page load, the app reads from `habit-tracker-session` to determine whether to redirect the user to the dashboard or login page.

This structure ensures that all user actions persist even after refreshing the browser.

---

## PWA Implementation

This application is implemented as a Progressive Web App (PWA), allowing it to behave like a native mobile application while running in the browser.

### Manifest File

The app includes a `manifest.json` file located in the public directory. This file defines how the application appears when installed on a device, including:

- Application name and short name
- App icons for different screen sizes
- Theme and background colors
- Start URL for the application

This enables the app to be installed on a user's device via the browser's "Add to Home Screen" feature.

### Service Worker

A service worker (`sw.js`) is used to provide basic offline support. It caches essential application assets during the initial load, allowing the app to:

- Load faster on subsequent visits
- Remain accessible even with limited or no internet connection (for previously loaded resources)

### Service Worker Registration

The service worker is registered in the application using a client-side component. This ensures that the browser activates the service worker and begins caching resources when the app is loaded.

### Limitations

The PWA implementation in this project provides basic caching and installability. However:

- It does not include advanced offline data synchronization
- Dynamic data (such as newly created habits) may not be available offline unless previously cached

Despite these limitations, the implementation meets the core requirements for a functional PWA.

---

## Trade-offs and Limitations

This project was designed to meet the requirements of a frontend-only application without a backend. As a result, several trade-offs were made:

- **No Backend Integration**  
  All data is stored in the browser using localStorage. This means data is not shared across devices and will be lost if the browser storage is cleared.

- **Basic Authentication**  
  User authentication is handled entirely on the client side. Passwords are stored in localStorage for this project, which is not secure for real-world applications.

- **Limited Data Persistence**  
  Since localStorage is used, the application does not support advanced features such as real-time updates, multi-device sync, or server-side validation.

- **Basic PWA Functionality**  
  The PWA implementation provides installability and basic caching, but does not include advanced offline-first features such as background sync or dynamic data caching.

- **Scalability Constraints**  
  This architecture is suitable for small-scale applications but would require a backend and database for production-level scalability.

These trade-offs were made intentionally to align with the project constraints while still delivering a functional and testable application.

---

## Required Test File Mapping

This section maps each required test file to the specific behavior it verifies, as required by the project specification.

### Unit Tests

| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/unit/slug.test.ts` | Verifies `getHabitSlug` converts habit names to lowercase hyphenated slugs, trims spaces, collapses repeated internal spaces, and removes non-alphanumeric characters except hyphens. |
| `tests/unit/validators.test.ts` | Verifies `validateHabitName` rejects empty names, rejects names longer than 60 characters, and returns trimmed values for valid input. |
| `tests/unit/streaks.test.ts` | Verifies `calculateCurrentStreak` returns 0 for empty completions, returns 0 when today is not completed, counts consecutive days correctly, ignores duplicates, and breaks streaks when a calendar day is missing. |
| `tests/unit/habits.test.ts` | Verifies `toggleHabitCompletion` adds dates when absent, removes dates when present, does not mutate the original habit object, and does not return duplicate completion dates. |

### Integration Tests

| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/integration/auth-flow.test.tsx` | Verifies the signup form creates a session, rejects duplicate emails, the login form stores an active session, and invalid credentials show an error message. |
| `tests/integration/habit-form.test.tsx` | Verifies the habit form shows validation errors for empty names, creates new habits and renders them, edits existing habits while preserving immutable fields (id, userId, createdAt, completions), deletes habits only after explicit confirmation, and toggles completion while updating the streak display. |

### End-to-End (E2E) Tests

| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/e2e/app.spec.ts` | Verifies the splash screen redirects unauthenticated users to `/login`, redirects authenticated users from `/` to `/dashboard`, prevents unauthenticated access to `/dashboard`, signs up a new user and lands on the dashboard, logs in an existing user and loads only that user's habits, creates a habit from the dashboard, completes a habit for today and updates the streak, persists session and habits after page reload, logs out and redirects to `/login`, and loads the cached app shell when offline after the app has been loaded once. |

---

## Test Coverage and Mapping

The project includes unit, integration, and end-to-end tests to ensure correctness across different layers of the application.

### Unit Tests

- `tests/unit/slug.test.ts`  
  Verifies slug generation logic used for consistent test IDs and UI mapping.

- `tests/unit/validators.test.ts`  
  Validates input rules such as required fields and character limits.

- `tests/unit/streaks.test.ts`  
  Tests streak calculation logic, including consecutive days, duplicates, and gaps.

- `tests/unit/habits.test.ts`  
  Verifies core habit utility functions such as creation, updates, and deletion.

---

### Integration Tests

- `tests/integration/auth-flow.test.tsx`  
  Verifies user authentication flow including:
  - Signup
  - Duplicate signup handling
  - Login
  - Invalid credential handling

- `tests/integration/habit-form.test.tsx`  
  Verifies habit management behavior including:
  - Validation errors
  - Habit creation
  - Habit editing (preserving immutable fields)
  - Habit deletion with confirmation
  - Completion toggling and streak updates

---

### End-to-End (E2E) Tests

- `tests/e2e/app.spec.ts`  
  Simulates full user interaction flow in a browser environment:
  - User signup
  - Login
  - Habit creation
  - Completion toggling
  - Editing a habit
  - Deleting a habit
  - Logout

These tests ensure that the application behaves correctly from isolated logic to full user interaction.

---

## Test Coverage Report

The project includes a high level of automated test coverage across unit, integration, and end-to-end tests.

To generate the coverage report:

```bash
npm run test:unit
```

Coverage output will be displayed in the terminal and includes:

- Statements coverage
- Branch coverage
- Function coverage
- Line coverage

The project achieves over 90% coverage for core utility logic such as habits, validation, slug generation, and streak calculation.
# Habit-Tracker
# Habit-Tracker

# 🎭 Doppler E2E Test Automation Framework

[![Playwright E2E Tests](https://github.com/doppler-pai/doppler-e2e-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/doppler-pai/doppler-e2e-tests/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-v1.50+-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?logo=node.js&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Page_Object_Model-8A2BE2)
![Tests](https://img.shields.io/badge/Test_Scenarios-29_Cases-blue)

An enterprise-grade, production-ready End-to-End (E2E) test automation framework engineered with **Playwright**, **TypeScript**, and a strict **Page Object Model (POM)** architecture for the **Doppler** multiplayer educational gaming web application.

---

## 📑 Table of Contents

- [Overview & Objectives](#-overview--objectives)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Project Directory Structure](#-project-directory-structure)
- [Test Strategy & Scenario Matrix](#-test-strategy--scenario-matrix)
- [Prerequisites & Getting Started](#-prerequisites--getting-started)
- [Test Execution Guide](#-test-execution-guide)
- [Reporting, Observability & Artifacts](#-reporting-observability--artifacts)
- [CI/CD Pipeline Architecture](#-cicd-pipeline-architecture)
- [Engineering Standards & Best Practices](#-engineering-standards--best-practices)

---

## 🎯 Overview & Objectives

This framework was built from the ground up as a portfolio-grade automation solution for **Junior / Mid QA Automation Engineer** standards. It verifies critical business flows of the Doppler web application, including authentication, real-time game lobby access, quiz set exploration and creation, form validations, accessibility, and responsive viewport edge cases.

### Core Strengths:
- **Zero Flakiness**: Deterministic execution powered by user-facing locators, auto-waiting mechanisms, and network route mocking for third-party Firebase services.
- **Strict Separation of Concerns**: Clean isolation between test specifications (`/tests`), Page Objects (`/pages`), test datasets (`/fixtures/data`), and fixture providers (`/fixtures`).
- **Comprehensive Observability**: Automated console error interceptors and page error listeners catching unhandled JavaScript runtime exceptions during tests.
- **Continuous Integration**: GitHub Actions CI workflow with cross-browser matrix, binary caching, failure trace collection, and downloadable HTML reports.

---

## 🏛 Architecture & Design Patterns

```
+-------------------------------------------------------------+
|                      Test Specifications                    |
|       (auth.spec.ts, play.spec.ts, sets.spec.ts, etc.)       |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|            Extended Test Fixtures (Dependency Injection)    |
|   (loginPage, playPage, setsExplorePage, assertNoConsoleErrors)|
+-------------------------------------------------------------+
            |                                      |
            v                                      v
+------------------------+             +----------------------+
|   Page Object Models   |             | Centralized Datasets |
| (BasePage -> Pages)    |             | (authData, setsData) |
+------------------------+             +----------------------+
            |
            v
+-------------------------------------------------------------+
|               Target Web Application (Doppler)              |
+-------------------------------------------------------------+
```

### 1. Page Object Model (POM)
- **`BasePage.ts`**: Foundational base class abstracting resilient page interactions, navigation, URL assertions, network response listeners, and screenshot capture.
- **Component & Page Classes**: Each page view encapsulates its selectors as `readonly Locator` properties initialized in the constructor. Priority is given to accessibility and user-facing locators (`getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`) avoiding brittle XPath or deep CSS chains.

### 2. Fixture-Driven Dependency Injection
Instead of manual instantiation in `beforeEach` blocks, all Page Objects and datasets are injected directly into tests via Playwright's extensible test runner (`test.extend`). This ensures:
- Isolated browser contexts and clean state per test.
- Automatic teardown and resource management.
- Built-in `consoleErrors` and `pageErrors` tracking with `assertNoConsoleErrors` assertion helpers.

### 3. Centralized Test Data
All test datasets, user credentials, boundary values, and expected validation strings are segregated in `fixtures/data/`. Tests contain zero hardcoded strings.

### 4. Network Interception & Determinism
Tests leverage Playwright's `page.route()` to mock backend endpoints (Firebase Identity Toolkit and Realtime Database). This enables fast, 100% predictable execution in any CI environment without external network latency or quota limitations.

---

## 📂 Project Directory Structure

```plaintext
doppler-e2e-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD pipeline definition
├── fixtures/
│   ├── data/
│   │   ├── authData.ts            # Authentication credentials, boundary inputs & messages
│   │   └── setsData.ts            # Quiz set structures, game lobby IDs & validation texts
│   ├── baseTest.ts                # Core fixture extension with console/error listeners
│   ├── authFixtures.ts            # Fixture providing LoginPage and RegisterPage
│   ├── appFixtures.ts             # Comprehensive fixture bundling all app Page Objects
│   └── index.ts                   # Centralized barrel export for fixtures and types
├── pages/
│   ├── BasePage.ts                # Abstract base page with enterprise helper methods
│   ├── LandingPage.ts             # POM for Home / Landing view (/)
│   ├── LoginPage.ts               # POM for Sign In view (/login)
│   ├── RegisterPage.ts            # POM for Registration view (/register)
│   ├── PlayPage.ts                # POM for Pre-Lobby & Game Join view (/play)
│   ├── SetsExplorePage.ts         # POM for Public Sets Explorer (/sets/explore)
│   ├── CreateSetPage.ts           # POM for Set Creation form (/sets/create)
│   └── SidebarComponent.ts        # POM for Navigation Sidebar component
├── tests/
│   ├── auth.spec.ts               # Authentication smoke, navigation, validation & API tests
│   ├── play.spec.ts               # Pre-lobby, security redirect, OTP validation & join tests
│   ├── sets.spec.ts               # Public sets explore, search filter & set creation tests
│   └── ui-edge-cases.spec.ts      # Viewport adaptability, keyboard a11y & UI robustness
├── .env.example                   # Template for environment variables
├── .gitignore                     # Git ignore rules for artifacts, reports & dependencies
├── package.json                   # Project metadata, dependencies & granular test scripts
├── playwright.config.ts           # Enterprise multi-browser and multi-reporter configuration
├── tsconfig.json                  # Strict TypeScript configuration with path aliases
└── README.md                      # Comprehensive project documentation
```

---

## 📊 Test Strategy & Scenario Matrix

The test suite covers **29 automated E2E scenarios** organized into 4 thematic suites:

| Suite | File | Focus Areas & Tags | Scenarios Count |
| :--- | :--- | :--- | :---: |
| **Authentication** | [`tests/auth.spec.ts`](file:///c:/Users/Admin.Matura/Documents/Doppler/doppler-e2e-tests/tests/auth.spec.ts) | `@smoke`, `@navigation`, `@negative`, `@validation`, `@edge-case`, `@happy`, `@auth` | 9 |
| **Play & Pre-Lobby** | [`tests/play.spec.ts`](file:///c:/Users/Admin.Matura/Documents/Doppler/doppler-e2e-tests/tests/play.spec.ts) | `@security`, `@smoke`, `@negative`, `@validation`, `@happy`, `@play` | 6 |
| **Sets & Exploration** | [`tests/sets.spec.ts`](file:///c:/Users/Admin.Matura/Documents/Doppler/doppler-e2e-tests/tests/sets.spec.ts) | `@smoke`, `@happy`, `@negative`, `@validation`, `@security`, `@sets` | 7 |
| **UI Validation & Edge Cases** | [`tests/ui-edge-cases.spec.ts`](file:///c:/Users/Admin.Matura/Documents/Doppler/doppler-e2e-tests/tests/ui-edge-cases.spec.ts) | `@edge-case`, `@responsive`, `@a11y`, `@keyboard`, `@security`, `@ui` | 7 |
| **Total** | | | **29** |

### Scenario Breakdown:

1. **Authentication (`auth.spec.ts`)**:
   - `[SMOKE]` Renders login page with all critical elements and zero console errors.
   - `[SMOKE]` Renders registration page with all required input fields.
   - `[HAPPY]` Navigates seamlessly between Login and Register views.
   - `[VALIDATION]` Displays validation errors when submitting empty login form.
   - `[VALIDATION]` Displays validation error when password is empty on login.
   - `[VALIDATION]` Displays all required field errors when submitting blank registration form.
   - `[VALIDATION]` Displays validation error when registration passwords do not match.
   - `[NEGATIVE]` Handles invalid credentials login with graceful error message.
   - `[EDGE-CASE]` Shows loading state on submit button during active sign-in request.
   - `[HAPPY]` Handles successful sign-in by updating session state.

2. **Play & Pre-Lobby (`play.spec.ts`)**:
   - `[SECURITY]` Redirects unauthenticated users to login page when accessing `/play`.
   - `[SMOKE]` Renders pre-lobby view with Game ID input and Join button.
   - `[VALIDATION]` Shows validation error when submitting blank game ID.
   - `[VALIDATION]` Shows length validation error when game ID has fewer than 6 characters.
   - `[NEGATIVE]` Shows server error message when attempting to join a non-existent game.
   - `[HAPPY]` Successfully initiates joining lobby when valid 6-digit game ID is entered.

3. **Quiz Sets & Exploration (`sets.spec.ts`)**:
   - `[SMOKE]` Renders public sets explorer view with search input and zero console errors.
   - `[HAPPY]` Allows user to enter search query and update input value.
   - `[NEGATIVE]` Displays empty search state when query matches no sets.
   - `[SECURITY]` Redirects unauthenticated users to login when accessing `/sets/create`.
   - `[VALIDATION]` Shows validation errors when saving an empty set.
   - `[HAPPY]` Toggles public/private switch and updates label text dynamically.
   - `[HAPPY]` Fills quiz set details and clears validation errors upon valid input.

4. **UI Validation & Edge Cases (`ui-edge-cases.spec.ts`)**:
   - `[RESPONSIVE]` Adapts landing page layout on mobile viewport (375x667) without horizontal overflow.
   - `[RESPONSIVE]` Renders login form strictly within mobile screen boundaries.
   - `[RESPONSIVE]` Renders public sets explorer correctly on tablet viewport (768x1024).
   - `[A11Y/KEYBOARD]` Supports full keyboard navigation (Tab and Enter) to submit login form without mouse.
   - `[A11Y/KEYBOARD]` Dismisses modal dialogs when Escape key is pressed.
   - `[SECURITY]` Safely handles special characters and XSS injection vectors in search input.
   - `[UI]` Prevents duplicate submissions by disabling button during request processing.

---

## 🚀 Prerequisites & Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **NPM**: `v10.x` or higher
- **Operating System**: Windows, macOS, or Linux

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/doppler-pai/doppler-e2e-tests.git
   cd doppler-e2e-tests
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps chromium
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *(Update `BASE_URL` in `.env` if targeting a remote staging deployment instead of `http://localhost:3000`)*.

---

## 💻 Test Execution Guide

The framework provides granular NPM scripts configured in `package.json`:

### Standard Runs
```bash
# Run all tests headlessly across configured projects
npm test

# Run tests in interactive Playwright UI Mode
npm run test:ui

# Run tests in headed browser mode (visible browser window)
npm run test:headed

# Run tests in step-by-step debug mode with Playwright Inspector
npm run test:debug
```

### Tag-Based Execution
```bash
# Run critical smoke tests (@smoke)
npm run test:smoke

# Run full regression suite excluding smoke tests
npm run test:regression

# Run authentication test scenarios only (@auth)
npm run test:auth

# Run play & pre-lobby scenarios only (@play)
npm run test:play

# Run sets & explore scenarios only (@sets)
npm run test:sets

# Run UI edge cases and responsiveness tests (@edge-case)
npm run test:edge
```

### Browser & Device Matrix Runs
```bash
# Run exclusively on Chromium (Desktop Chrome)
npm run test:chromium

# Run exclusively on Firefox
npm run test:firefox

# Run exclusively on WebKit (Desktop Safari)
npm run test:webkit

# Run in Mobile Chrome (Pixel 5 emulation)
npm run test:mobile
```

### Maintenance & Static Analysis
```bash
# Verify TypeScript compilation and type safety without emitting files
npm run typecheck

# Clean previous test results, screenshots, and HTML reports
npm run clean
```

---

## 📈 Reporting, Observability & Artifacts

The framework includes a multi-reporter setup configured in [`playwright.config.ts`](file:///c:/Users/Admin.Matura/Documents/Doppler/doppler-e2e-tests/playwright.config.ts):

1. **HTML Report**: Rich interactive report detailing step-by-step execution, screenshots, traces, and DOM snapshots.
   ```bash
   npm run report
   ```
2. **JUnit XML Report** (`test-results/junit.xml`): Standard test execution report format ingested by CI engines (GitHub Actions, Jenkins, Azure DevOps) to render test summaries and trends.
3. **Structured JSON Report** (`test-results/report.json`): Machine-readable results suitable for custom test dashboards and metrics aggregators.
4. **GitHub Step Summary**: Inline GitHub Actions test status and annotations on Pull Requests.
5. **Failure Artifacts**:
   - Full trace archives (`trace.zip`) captured on test retry (`retain-on-failure` locally).
   - Full-page screenshots captured on failure (`screenshot: 'only-on-failure'`).
   - Video recordings retained upon test failure (`video: 'retain-on-failure'`).

---

## 🔄 CI/CD Pipeline Architecture

The automated continuous integration workflow is implemented in [`.github/workflows/playwright.yml`](file:///c:/Users/Admin.Matura/Documents/Doppler/doppler-e2e-tests/.github/workflows/playwright.yml):

- **Triggers**:
  - Automatically runs on every `push` and `pull_request` targeting `main` or `master`.
  - Manual execution via `workflow_dispatch` with input filters for tags (`@smoke`, `@regression`) and browser selection.
- **Optimization**:
  - `actions/cache@v4` caches Playwright browser binaries between workflow runs, reducing build duration significantly.
  - Concurrency management cancels superseded pull request runs automatically.
- **Reporting & Retention**:
  - Test reports are archived and uploaded as GitHub Actions artifacts (`actions/upload-artifact@v4`) retained for 14 days, accessible even when tests fail (`if: ${{ !cancelled() }}`).

---

## 🛡 Engineering Standards & Best Practices

- **Strict TypeScript Typing**: No `any` types; all page objects, test fixtures, and datasets are strictly typed with auto-completion support.
- **Path Aliases**: Clean import paths configured in `tsconfig.json` (`@pages/*`, `@fixtures/*`, `@data/*`).
- **Resilient Locators**: Avoidance of hardcoded XPath, IDs, or fragile CSS selectors in favor of user-centric accessibility roles and labels.
- **Cross-Platform Compatibility**: Scripts and file handling run identically across Windows, macOS, and Linux without OS-dependent binaries.
- **Conventional Commits**: Every stage of development follows the Conventional Commits specification (`feat:`, `test:`, `ci:`, `chore:`).

---

## 👤 Author & Portfolio

- **Author**: KubaL09
- **Repository**: [doppler-pai/doppler-e2e-tests](https://github.com/doppler-pai/doppler-e2e-tests)
- **Role Target**: Junior / Mid QA Automation Engineer

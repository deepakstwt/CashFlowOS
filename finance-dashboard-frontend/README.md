# Zorvyn: Financial Dashboard Frontend
[🏠 Back to Main Overview](../README.md)


[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black)](#)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue)](#)
[![Recharts](https://img.shields.io/badge/UI-Recharts-orange)](#)

A modern, responsive financial dashboard built for high-level data visualization and management. This application interfaces with the Zorvyn Backend to provide real-time updates and seamless ledger management.

---

## ✨ Features

- **Dynamic Visualization**: Interactive charts for income, expense, and net wealth summaries.
- **Ledger Management**: Unified ledger view with filtering, searching, and pagination.
- **Secure Sessions**: Persistent JWT-based authentication with role-based access.
- **CSV Portability**: Export any filtered view of your financial data to a CSV file.
- **Responsive Design**: Designed with a "mobile-first" approach, fully optimized for all screen sizes.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Backend running at `http://localhost:3000`

### 2. Installation
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd finance-dashboard-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🏗 Key Structure
```text
finance-dashboard-frontend/
├── app/               # Next.js App Router (Dashboard, Ledger, Auth)
├── components/        # UI components (Charts, Forms, Modals)
├── lib/               # API client (Axios) and utility functions
└── public/            # Static assets and icons
```

---

## 🛠 Tech Decisions & Tradeoffs

- **Next.js App Router**: Chosen for its built-in optimizations for routing and server-side rendering, ensuring a fast initial load.
- **Recharts for Data Viz**: Selected for its balance between flexibility and ease of use, allowing for beautiful, responsive charts.
- **Axios Interceptors**: Used for centralizing authentication handling (injecting Bearer tokens) and standardizing error responses.
- **Tailwind CSS Utility Classes**: Allows for rapid iteration on the "premium dark mode" aesthetic without the bloat of traditional CSS-in-JS libraries.

---

## 📈 Roadmap
- [ ] **Advanced Filtering**: Date-range pickers and multi-category selection.
- [ ] **Accessibility (A11y)**: Fully auditing all components for WCAG compliance.
- [ ] **Skeleton Loading**: Implementing smooth loading states for all async components.

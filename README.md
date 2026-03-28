<div align="center">

<img src="https://img.shields.io/badge/SplitMate-Finance%20Manager-4f46e5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMSAxN3YtNkg5bDMtNCAzIDRoLTJ2NmgtMnoiLz48L3N2Zz4=" />

# 💰Wealth

### AI-Powered Personal Finance Manager

_Track smarter. Save better. Live freely._

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## 🌟 What is Wealth?

**Wealth** is a full-stack personal finance management web application built on the **MERN stack**. It gives you complete control over your financial life — from tracking daily expenses and setting savings goals, to getting AI-powered spending insights and generating downloadable financial reports.

Whether you're managing solo finances or splitting bills with friends, Wealth makes money management effortless and visual.

---

## ✨ Features at a Glance

| Feature                        | Description                                                             |
| ------------------------------ | ----------------------------------------------------------------------- |
| 📊 **AI Financial Dashboard**  | Real-time spending overview with interactive charts and smart insights  |
| 💰 **Expense Tracking**        | Log expenses by category with icons, dates, and full delete support     |
| 📋 **Budget Planner**          | Set per-category budgets with visual progress bars and overspend alerts |
| 🎯 **Savings Goals**           | Create goals, track progress, add money, celebrate completions          |
| 🔄 **Recurring Payments**      | Manage subscriptions and bills with due date reminders                  |
| 📈 **Financial Reports**       | Category breakdowns, trend charts, and CSV/JSON export                  |
| 🤖 **AI Insights**             | Personalized spending tips and budget health scoring                    |
| 🕐 **Activity Feed**           | Chronological log of all financial events with search and filters       |
| ⚙️ **Settings**                | Profile management, photo upload, data import/export, notifications     |
| 🌓 **Global Dark/Light Theme** | Persistent theme toggle across all pages                                |
| 🔐 **Secure Auth**             | JWT-based authentication with bcrypt password hashing                   |
| 👥 **Multi-User Support**      | Each user's data is completely isolated — zero data leakage             |

---

## 🖼️ Screenshots

> _Clean dark theme UI with a premium fintech aesthetic_

### Dashboard

The central hub — shows balance, spent, owed, budget health, AI smart insight, recent transactions, and upcoming payments — all starting at zero for every new user.

### Budget Planner

Create category budgets, track spending vs limits, and customize your overall monthly limit — all saved per user.

### Savings Goals

Visual goal cards with progress bars, priority badges, and a celebration animation when a goal is completed.

### Reports & Analytics

Live charts built from your real transactions — category breakdown pie chart, day-wise spending line chart, and top 5 expenses table.

### AI Insights

Personalized savings tips, budget health score gauge, and spending trend charts — all powered by your real data.

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Version | Purpose                         |
| ------------------- | ------- | ------------------------------- |
| **React**           | 19      | UI Framework                    |
| **React Router v6** | 6.x     | Client-side routing             |
| **Recharts**        | Latest  | Charts and data visualization   |
| **Lucide React**    | Latest  | Icon library                    |
| **Axios**           | Latest  | HTTP client for API calls       |
| **Plain CSS**       | —       | Styling (no Tailwind/Bootstrap) |

### Backend

| Technology         | Version | Purpose                         |
| ------------------ | ------- | ------------------------------- |
| **Node.js**        | 18+     | Runtime environment             |
| **Express.js**     | 4.x     | REST API framework              |
| **MongoDB Atlas**  | Cloud   | NoSQL database                  |
| **Mongoose**       | Latest  | ODM for MongoDB                 |
| **JSON Web Token** | Latest  | Stateless authentication        |
| **bcryptjs**       | Latest  | Password hashing                |
| **dotenv**         | Latest  | Environment variable management |

---

## 📁 Project Structure

```
Wealth/
├── client/                          # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx           # Global navbar with theme toggle
│       ├── pages/
│       │   ├── Dashboard.jsx        # AI financial dashboard
│       │   ├── Budget.jsx           # Budget planner
│       │   ├── Categories.jsx       # Category management
│       │   ├── Recurring.jsx        # Recurring payments
│       │   ├── Goals.jsx            # Savings goals
│       │   ├── Insights.jsx         # AI insights
│       │   ├── Reports.jsx          # Financial reports
│       │   ├── Activity.jsx         # Activity feed
│       │   ├── Settings.jsx         # User settings
│       │   ├── Login.jsx            # Login page
│       │   └── Register.jsx         # Registration page
│       ├── App.js                   # Global theme state + routing
│       ├── index.js                 # App entry point
│       └── index.css                # Global styles and CSS variables
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Expense.js               # Expense schema
│   │   ├── Budget.js                # Budget schema
│   │   ├── Goal.js                  # Goal schema
│   │   ├── Recurring.js             # Recurring payments schema
│   │   └── Category.js              # Custom categories schema
│   ├── controllers/
│   │   ├── authController.js        # Login / Register logic
│   │   └── expenseController.js     # Expense CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT token verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── expenseRoutes.js
│   ├── .env                         # Environment variables (not committed)
│   └── index.js                     # Server entry point
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/Veda-Shiva-Prasad/SplitMate.git
cd SplitMate
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server:

```bash
npm run dev
```

> Server runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

> App opens at `http://localhost:3000`

---

## 🔑 Core Functionality Deep Dive

### 🏠 Dashboard

- Displays Total Balance, Total Spent, Monthly Budget, and "You Are Owed" — all starting at ₹0 for every new account
- Spending Analysis chart automatically updates based on your real transactions (weekly and monthly view)
- AI Smart Insight card dynamically adjusts its message based on your actual spending
- Budget Health Score calculated in real time from your transactions
- Full delete support on every transaction

### 💰 Budget Planner

- Set an **editable overall monthly limit** (click "Change Limit" button)
- Category budgets stored per user — new accounts start with zero budgets
- Warning badges at 80% usage, exceeded badges at 100%
- Carry-over unused budget toggle

### 🎯 Savings Goals

- All goal data stored in localStorage per user key
- Add Money feature with live progress bar updates
- 🎉 Celebration banner animation on goal completion
- Archive and delete support
- Empty state screen for new users

### 🔄 Recurring Payments

- Stored per user — new accounts start empty
- Mark as Paid toggle per subscription
- Enable/Disable toggle
- Urgent highlight for payments due within 3 days

### 📈 Reports

- All charts built from real transaction data — no fake placeholder data
- CSV export downloads a real `.csv` file that opens in Excel
- Empty state displayed for new users with no transactions

### ⚙️ Settings

- Profile photo upload with FileReader (stores as base64)
- CSV export and import with real file download and parsing
- JSON backup export
- Clear all transactions with confirmation

### 🌓 Theme

- Global dark/light theme managed in `App.js` state
- Persisted to `localStorage` under `splitmate_theme`
- Passes down to every page via props — toggling once applies everywhere

### 🔐 Authentication & Data Isolation

- On login: only auth tokens are cleared, all `splitmate_*` data is preserved
- Each user's expenses, budgets, goals, and recurring data are stored under their email as a unique key
- Logging into a new account shows a completely clean slate

---

## 📊 Database Schemas

```javascript
// User
{ name: String, email: String (unique), password: String (hashed), createdAt: Date }

// Expense
{ userId: ObjectId, name: String, category: String, amount: Number, date: Date, icon: String, rawDate: String }

// Budget
{ userId: ObjectId, category: String, limit: Number, spent: Number, color: String }

// Goal
{ userId: ObjectId, name: String, target: Number, saved: Number, deadline: Date, priority: String, icon: String, archived: Boolean }

// Recurring
{ userId: ObjectId, name: String, amount: Number, frequency: String, category: String, nextDue: Date, icon: String, active: Boolean, paid: Boolean }
```

---

## 🎨 Design System

```css
/* Color Palette */
--bg-color: #0a0f1e /* Deep navy background */ --card-bg: #111827
  /* Dark card surfaces */ --border-color: #1e2d45 /* Subtle borders */
  --primary-accent: #3b82f6 /* Electric blue */ --positive: #10b981
  /* Emerald green */ --negative: #f43f5e /* Rose red */ --warning: #f59e0b
  /* Amber */ --text-primary: #f1f5f9 /* Near white */ --text-secondary: #94a3b8
  /* Slate gray */;
```

All styles are written in **pure CSS and inline React styles** — no Tailwind, no Bootstrap.

---

## 🔐 Security

- Passwords hashed with **bcryptjs** before storage
- All protected routes require a valid **JWT token** in headers
- Environment variables stored in `.env` — never committed to git
- Per-user data isolation via unique email-keyed localStorage namespacing
- `localStorage.clear()` on logout preserves user data, only wipes auth tokens

---

## 🗺️ Roadmap

- [ ] Connect all frontend pages to MongoDB backend APIs
- [ ] Real AI integration (OpenAI API for insights)
- [ ] Push notifications for bill due dates
- [ ] Mobile responsive layout
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Google OAuth login
- [ ] PDF report generation

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo, then:
git checkout -b feature/YourFeature
git commit -m "Add: YourFeature description"
git push origin feature/YourFeature
# Open a Pull Request
```

---

## 👨‍💻 Developer

<div align="center">

**Avinash Nandre**

B.tech Graduate • Full Stack Developer • MERN Stack

[![GitHub]](https://github.com/-AviBNandre)

</div>

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

_It helps others discover the project and keeps me motivated to build more._

Made with ❤️ by **Veda Shiva Prasad** — Hyderabad, India 🇮🇳

</div>

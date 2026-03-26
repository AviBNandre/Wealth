import React, { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  X,
  AlertCircle,
  Trash2,
  Users,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import Navbar from "../components/Navbar.jsx";
import API from "../utils/api";

const Dashboard = ({ isDarkMode, setIsDarkMode }) => {
  const [chartView, setChartView] = useState("weekly");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showOwedModal, setShowOwedModal] = useState(false);
  const [showBudgetEditModal, setShowBudgetEditModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: "",
  });
  const [owedForm, setOwedForm] = useState({
    name: "",
    amount: "",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(20000);
  const [newBudgetValue, setNewBudgetValue] = useState(monthlyBudget);
  const [savingBudget, setSavingBudget] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const userName = localStorage.getItem("userName") || "User";

  const [transactions, setTransactions] = useState([]);
  const [owedList, setOwedList] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    setPageLoaded(true);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const expensesRes = await API.get("/expenses");
      setTransactions(expensesRes.data || []);

      const owedRes = await API.get("/owed");
      setOwedList(owedRes.data || []);

      const summaryRes = await API.get("/expenses/summary");
      setSummary({
        totalSpent: summaryRes.data?.totalExpense || 0,
        transactionCount: summaryRes.data?.transactionCount || 0,
      });

      const budgetRes = await API.get("/budgets/limit");
      const budgetLimit = budgetRes.data?.limit || 20000;
      setMonthlyBudget(budgetLimit);
      setNewBudgetValue(budgetLimit);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTransactions([]);
      setOwedList([]);
      setSummary({ totalSpent: 0, transactionCount: 0 });
      setMonthlyBudget(20000);
      setNewBudgetValue(20000);
    } finally {
      setLoading(false);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const builtWeeklyData = days.map((day) => {
    const total = (transactions || [])
      .filter((tx) => {
        if (!tx.rawDate) return false;
        const txDate = new Date(tx.rawDate);
        return days[txDate.getDay()] === day;
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
    return { name: day, amount: total };
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const builtMonthlyData = months.map((month, idx) => {
    const total = (transactions || [])
      .filter((tx) => {
        if (!tx.rawDate) return false;
        const txDate = new Date(tx.rawDate);
        return txDate.getMonth() === idx;
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
    return { name: month, amount: total };
  });

  const handleAddExpense = async () => {
    if (!expenseForm.description.trim()) {
      setFormError("Please enter a title.");
      return;
    }
    if (
      !expenseForm.amount ||
      isNaN(expenseForm.amount) ||
      Number(expenseForm.amount) <= 0
    ) {
      setFormError("Please enter a valid amount.");
      return;
    }
    if (!expenseForm.date) {
      setFormError("Please select a date.");
      return;
    }

    const categoryIcons = {
      Food: "🍔",
      Transport: "🚗",
      Bills: "⚡",
      Entertainment: "🎬",
      Health: "💊",
      Shopping: "🛒",
      Other: "📦",
    };

    try {
      await API.post("/expenses", {
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        date: expenseForm.date,
        icon: categoryIcons[expenseForm.category] || "📦",
      });

      setExpenseForm({
        description: "",
        amount: "",
        category: "Food",
        date: "",
      });
      setFormError("");
      setShowExpenseModal(false);
      fetchAllData();
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to add expense");
    }
  };

  const handleAddOwed = async () => {
    if (!owedForm.name.trim()) {
      setFormError("Please enter a name.");
      return;
    }
    if (
      !owedForm.amount ||
      isNaN(owedForm.amount) ||
      Number(owedForm.amount) <= 0
    ) {
      setFormError("Please enter a valid amount.");
      return;
    }

    try {
      await API.post("/owed", {
        name: owedForm.name,
        amount: Number(owedForm.amount),
        description: owedForm.description || "Shared expense",
      });

      setOwedForm({ name: "", amount: "", description: "" });
      setFormError("");
      setShowOwedModal(false);
      fetchAllData();
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to add owed entry");
    }
  };

  const handleMarkSettled = async (id) => {
    try {
      await API.put(`/owed/${id}/settle`);
      fetchAllData();
    } catch (error) {
      console.error("Error settling owed:", error);
    }
  };

  const handleDeleteOwed = async (id) => {
    try {
      await API.delete(`/owed/${id}`);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting owed:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleUpdateBudget = async () => {
    if (newBudgetValue && newBudgetValue > 0) {
      setSavingBudget(true);
      try {
        await API.put("/budgets/limit", { limit: newBudgetValue });
        setMonthlyBudget(newBudgetValue);
        setShowBudgetEditModal(false);
        await fetchAllData();
      } catch (error) {
        console.error("Error updating budget:", error);
        alert("Failed to update budget. Please try again.");
      } finally {
        setSavingBudget(false);
      }
    } else {
      alert("Please enter a valid budget amount");
    }
  };

  const totalSpent = summary?.totalSpent || 0;
  const totalBalance = (transactions || []).reduce(
    (sum, tx) => sum + (tx?.amount || 0),
    0,
  );
  const totalOwed = (owedList || [])
    .filter((item) => !item?.settled)
    .reduce((sum, item) => sum + (item?.amount || 0), 0);
  const pendingOwedCount = (owedList || []).filter(
    (item) => !item?.settled,
  ).length;

  const categoryColors = {
    Food: "#F59E0B",
    Transport: "#3B82F6",
    Bills: "#8B5CF6",
    Entertainment: "#EC4899",
    Health: "#10B981",
    Shopping: "#F43F5E",
    Other: "#94A3B8",
  };
  const categoryLimits = {
    Food: 5000,
    Transport: 2000,
    Bills: 3000,
    Entertainment: 1000,
    Health: 1500,
    Shopping: 2000,
    Other: 1000,
  };
  const categorySpending = {};
  (transactions || []).forEach((tx) => {
    if (tx?.category) {
      categorySpending[tx.category] =
        (categorySpending[tx.category] || 0) + Math.abs(tx.amount || 0);
    }
  });
  const categoryBudgets = Object.keys(categoryLimits).map((cat) => ({
    name: cat,
    spent: categorySpending[cat] || 0,
    limit: categoryLimits[cat],
    color: categoryColors[cat],
  }));

  const theme = {
    bg: isDarkMode ? "#0A0F1E" : "#F1F5F9",
    card: isDarkMode ? "#111827" : "#FFFFFF",
    border: isDarkMode ? "#1E2D45" : "#E2E8F0",
    text: isDarkMode ? "#F1F5F9" : "#1E293B",
    secondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#3B82F6",
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: theme.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: theme.text,
            fontSize: "18px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        minHeight: "100vh",
        color: theme.text,
        opacity: pageLoaded ? 1 : 0,
        transform: pageLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main style={{ padding: "36px 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <div className="animate-fadeInUp">
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "800",
                margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              AI Financial Dashboard
            </h1>
            <p
              style={{
                color: theme.secondary,
                margin: "4px 0 0 0",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Welcome back, {userName} 👋 Here's your financial overview
            </p>
          </div>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="hover-glow"
            style={{
              backgroundColor: theme.primary,
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Plus size={18} /> Add New Expense
          </button>
        </div>

        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          {[
            {
              title: "Total Balance",
              value: `${totalBalance >= 0 ? "" : "-"}₹${Math.abs(totalBalance || 0).toLocaleString("en-IN")}`,
              sub:
                (transactions || []).length === 0
                  ? "No transactions yet"
                  : `${(transactions || []).length} total transactions`,
              color: totalBalance >= 0 ? "#10B981" : "#F43F5E",
              icon: <TrendingUp size={18} color="#10B981" />,
            },
            {
              title: "Total Spent",
              value: `₹${(totalSpent || 0).toLocaleString("en-IN")}`,
              sub: `${summary?.transactionCount || 0} expense transactions`,
              color: "#F43F5E",
              icon: <TrendingDown size={18} color="#F43F5E" />,
            },
            {
              title: "You Are Owed",
              value: `₹${(totalOwed || 0).toLocaleString("en-IN")}`,
              sub:
                pendingOwedCount === 0
                  ? "No pending settlements"
                  : `${pendingOwedCount} pending settlement${pendingOwedCount > 1 ? "s" : ""}`,
              color: "#10B981",
              icon: <Users size={18} color="#10B981" />,
              action: () => setShowOwedModal(true),
            },
            {
              title: "Monthly Budget",
              value: `₹${(monthlyBudget || 0).toLocaleString("en-IN")}`,
              sub: `₹${(totalSpent || 0).toLocaleString("en-IN")} used (${Math.min(Math.round(((totalSpent || 0) / (monthlyBudget || 1)) * 100), 100)}%)`,
              color: "#F59E0B",
              progress: Math.min(
                Math.round(((totalSpent || 0) / (monthlyBudget || 1)) * 100),
                100,
              ),
              icon: null,
              action: () => setShowBudgetEditModal(true),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="hover-lift"
              style={{
                backgroundColor: theme.card,
                padding: "24px",
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
                transition: "all 0.2s",
                cursor: card.action ? "pointer" : "default",
              }}
              onClick={card.action}
            >
              <p
                style={{
                  color: theme.secondary,
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {card.title}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: card.color,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {card.value}
                </h2>
                {card.icon}
              </div>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "12px",
                  color: theme.secondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {card.sub}
              </p>
              {card.progress !== undefined && (
                <div
                  style={{
                    height: "6px",
                    background: theme.border,
                    borderRadius: "10px",
                    marginTop: "12px",
                  }}
                >
                  <div
                    style={{
                      width: `${card.progress}%`,
                      height: "100%",
                      background: card.progress > 80 ? "#F43F5E" : "#F59E0B",
                      borderRadius: "10px",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            marginBottom: "28px",
          }}
        >
          <div
            className="animate-scaleIn"
            style={{
              backgroundColor: theme.card,
              padding: "28px",
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "700",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Spending Analysis
              </h3>
              <div style={{ display: "flex", gap: "8px" }}>
                {["weekly", "monthly"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className="hover-scale"
                    style={{
                      background:
                        chartView === v ? theme.primary : "transparent",
                      color: chartView === v ? "white" : theme.secondary,
                      border: `1px solid ${chartView === v ? theme.primary : theme.border}`,
                      padding: "5px 14px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartView === "weekly" ? (
                  <BarChart data={builtWeeklyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.border}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={theme.secondary}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={theme.secondary}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.card,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "10px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      formatter={(v) => [`₹${v}`, "Spent"]}
                    />
                    <Bar
                      dataKey="amount"
                      fill={theme.primary}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={builtMonthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.border}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={theme.secondary}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={theme.secondary}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.card,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "10px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      formatter={(v) => [`₹${v}`, "Spent"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={theme.primary}
                      strokeWidth={3}
                      dot={{ fill: theme.primary, r: 5 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="animate-scaleIn"
            style={{
              background: "linear-gradient(135deg, #1E3A5F 0%, #0A0F1E 100%)",
              padding: "28px",
              borderRadius: "20px",
              border: "1px solid #1E2D45",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    background: "#3B82F620",
                    padding: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <TrendingUp size={20} color="#3B82F6" />
                </div>
                <span
                  style={{
                    color: "#3B82F6",
                    fontWeight: "800",
                    fontSize: "14px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  AI Smart Insight
                </span>
              </div>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.7",
                  fontWeight: "500",
                  color: "#F1F5F9",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {userName.split(" ")[0]},{" "}
                {(totalSpent || 0) === 0 ? (
                  "you have no expenses yet. Start adding your transactions to get personalized insights."
                ) : (
                  <>
                    you have spent{" "}
                    <span style={{ color: "#F43F5E", fontWeight: "800" }}>
                      ₹{(totalSpent || 0).toLocaleString("en-IN")}
                    </span>{" "}
                    so far this month.{" "}
                    {(totalOwed || 0) > 0 && (
                      <>
                        Also, {pendingOwedCount} person
                        {pendingOwedCount > 1 ? "s" : ""} owe you ₹
                        {(totalOwed || 0).toLocaleString("en-IN")}.
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
            <div
              style={{
                background: "#10B98120",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              <AlertCircle size={16} color="#10B981" />
              <span
                style={{
                  color: "#10B981",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Budget Health Score:{" "}
                {(totalSpent || 0) === 0
                  ? "100"
                  : Math.max(
                      100 -
                        Math.round(
                          ((totalSpent || 0) / (monthlyBudget || 1)) * 100,
                        ),
                      0,
                    )}
                /100
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: "24px",
          }}
        >
          <div
            className="animate-fadeInUp"
            style={{
              backgroundColor: theme.card,
              padding: "24px",
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                fontWeight: "700",
                fontSize: "16px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Recent Transactions
            </h3>
            {(transactions || []).length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: theme.secondary,
                }}
              >
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>💸</p>
                <p
                  style={{
                    fontSize: "14px",
                    margin: 0,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  No transactions yet.
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    margin: "4px 0 0 0",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Click "Add New Expense" to begin.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "320px",
                  overflowY: "auto",
                }}
              >
                {(transactions || []).slice(0, 10).map((tx) => (
                  <div
                    key={tx.id || tx._id}
                    className="hover-lift"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>
                        {tx.icon || "📦"}
                      </span>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            fontSize: "13px",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {tx.name || tx.description}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: theme.secondary,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {tx.date || "No date"} · {tx.category || "Other"}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          color: (tx.amount || 0) > 0 ? "#10B981" : "#F43F5E",
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {(tx.amount || 0) > 0 ? "+" : ""}₹
                        {Math.abs(tx.amount || 0).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(tx.id || tx._id)}
                        className="hover-scale"
                        style={{
                          background: "#F43F5E20",
                          border: "none",
                          color: "#F43F5E",
                          borderRadius: "6px",
                          padding: "4px 7px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="animate-fadeInUp"
            style={{
              backgroundColor: theme.card,
              padding: "24px",
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                fontWeight: "700",
                fontSize: "16px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Budget Progress
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {categoryBudgets.map((cat) => {
                const pct =
                  cat.limit > 0
                    ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100)
                    : 0;
                return (
                  <div key={cat.name} className="animate-fadeIn">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {cat.name}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: pct > 80 ? "#F43F5E" : theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        ₹{(cat.spent || 0).toLocaleString()} / ₹
                        {(cat.limit || 0).toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: theme.border,
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: pct > 80 ? "#F43F5E" : cat.color,
                          borderRadius: "10px",
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="animate-fadeInUp"
            style={{
              backgroundColor: theme.card,
              padding: "24px",
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "700",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Users size={18} color="#10B981" /> You Are Owed
              </h3>
              <button
                onClick={() => setShowOwedModal(true)}
                className="hover-scale"
                style={{
                  background: `${theme.primary}20`,
                  color: theme.primary,
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <UserPlus size={14} /> Add
              </button>
            </div>
            {(owedList || []).filter((item) => !item?.settled).length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: theme.secondary,
                }}
              >
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>🤝</p>
                <p
                  style={{
                    fontSize: "14px",
                    margin: 0,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  No pending settlements.
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    margin: "4px 0 0 0",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Add people who owe you money.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxHeight: "320px",
                  overflowY: "auto",
                }}
              >
                {(owedList || [])
                  .filter((item) => !item?.settled)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="hover-lift"
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        background: `${theme.primary}08`,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: "700",
                              fontSize: "14px",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              margin: "2px 0 0 0",
                              fontSize: "11px",
                              color: theme.secondary,
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {item.description} •{" "}
                            {item.date
                              ? new Date(item.date).toLocaleDateString("en-IN")
                              : "No date"}
                          </p>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: "800",
                            fontSize: "16px",
                            color: "#10B981",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          ₹{(item.amount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => handleMarkSettled(item._id)}
                          className="hover-scale"
                          style={{
                            background: "#10B98120",
                            color: "#10B981",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          <CheckCircle size={12} /> Settled
                        </button>
                        <button
                          onClick={() => handleDeleteOwed(item._id)}
                          className="hover-scale"
                          style={{
                            background: "#F43F5E20",
                            color: "#F43F5E",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowExpenseModal(false)}
        >
          <div
            className="animate-scaleIn"
            style={{
              background: theme.card,
              borderRadius: "24px",
              padding: "32px",
              width: "440px",
              maxWidth: "90%",
              border: `1px solid ${theme.border}`,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "800",
                  fontSize: "20px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Add New Expense
              </h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="hover-scale"
                style={{
                  background: "none",
                  border: "none",
                  color: theme.secondary,
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>
            {[
              {
                label: "Expense Title",
                key: "description",
                type: "text",
                placeholder: "e.g. Swiggy Order",
              },
              {
                label: "Amount (₹)",
                key: "amount",
                type: "number",
                placeholder: "e.g. 450",
              },
              { label: "Date", key: "date", type: "date", placeholder: "" },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    color: theme.secondary,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={expenseForm[field.key]}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      [field.key]: e.target.value,
                    })
                  }
                  className="hover-lift"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "12px",
                    color: theme.text,
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  color: theme.secondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Category
              </label>
              <select
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, category: e.target.value })
                }
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "12px",
                  color: theme.text,
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {[
                  "Food",
                  "Transport",
                  "Bills",
                  "Entertainment",
                  "Health",
                  "Shopping",
                  "Other",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {formError && (
              <p
                style={{
                  color: "#F43F5E",
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {formError}
              </p>
            )}
            <button
              onClick={handleAddExpense}
              className="hover-glow"
              style={{
                width: "100%",
                background: theme.primary,
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease",
              }}
            >
              Add Expense
            </button>
          </div>
        </div>
      )}

      {/* Add Owed Modal */}
      {showOwedModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowOwedModal(false)}
        >
          <div
            className="animate-scaleIn"
            style={{
              background: theme.card,
              borderRadius: "24px",
              padding: "32px",
              width: "440px",
              maxWidth: "90%",
              border: `1px solid ${theme.border}`,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "800",
                  fontSize: "20px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Who Owes You Money?
              </h3>
              <button
                onClick={() => setShowOwedModal(false)}
                className="hover-scale"
                style={{
                  background: "none",
                  border: "none",
                  color: theme.secondary,
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  display: "block",
                  color: theme.secondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Person's Name
              </label>
              <input
                type="text"
                placeholder="e.g. Arjun Sharma"
                value={owedForm.name}
                onChange={(e) =>
                  setOwedForm({ ...owedForm, name: e.target.value })
                }
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "12px",
                  color: theme.text,
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  display: "block",
                  color: theme.secondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={owedForm.amount}
                onChange={(e) =>
                  setOwedForm({ ...owedForm, amount: e.target.value })
                }
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "12px",
                  color: theme.text,
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  display: "block",
                  color: theme.secondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dinner at The Great Indian"
                value={owedForm.description}
                onChange={(e) =>
                  setOwedForm({ ...owedForm, description: e.target.value })
                }
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "12px",
                  color: theme.text,
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            {formError && (
              <p
                style={{
                  color: "#F43F5E",
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {formError}
              </p>
            )}
            <button
              onClick={handleAddOwed}
              className="hover-glow"
              style={{
                width: "100%",
                background: theme.primary,
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Add Owed Amount
            </button>
          </div>
        </div>
      )}

      {/* Edit Monthly Budget Modal */}
      {showBudgetEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowBudgetEditModal(false)}
        >
          <div
            className="animate-scaleIn"
            style={{
              background: theme.card,
              borderRadius: "24px",
              padding: "32px",
              width: "380px",
              maxWidth: "90%",
              border: `1px solid ${theme.border}`,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "800",
                  fontSize: "20px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Edit Monthly Budget
              </h3>
              <button
                onClick={() => setShowBudgetEditModal(false)}
                className="hover-scale"
                style={{
                  background: "none",
                  border: "none",
                  color: theme.secondary,
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p
              style={{
                color: theme.secondary,
                fontSize: "13px",
                margin: "0 0 20px 0",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Current budget: ₹{(monthlyBudget || 0).toLocaleString("en-IN")}
            </p>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "8px",
                display: "block",
                color: theme.secondary,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              New Monthly Budget (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 30000"
              value={newBudgetValue}
              onChange={(e) => setNewBudgetValue(parseInt(e.target.value) || 0)}
              className="hover-lift"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: "12px",
                color: theme.text,
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'Inter', sans-serif",
                marginTop: "8px",
              }}
            />
            <button
              onClick={handleUpdateBudget}
              disabled={savingBudget}
              className="hover-glow"
              style={{
                width: "100%",
                background: theme.primary,
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: savingBudget ? "not-allowed" : "pointer",
                marginTop: "24px",
                opacity: savingBudget ? 0.7 : 1,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {savingBudget ? "Saving..." : "Save New Budget"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

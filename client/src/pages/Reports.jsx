import React, { useState, useEffect } from "react";
import { Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Navbar from "../components/Navbar.jsx";
import { useData } from "../context/DataContext";

const CATEGORY_COLORS = {
  Food: "#F59E0B",
  Transport: "#3B82F6",
  Bills: "#8B5CF6",
  Entertainment: "#EC4899",
  Health: "#10B981",
  Shopping: "#F43F5E",
  Other: "#94A3B8",
};

const Reports = ({ isDarkMode, setIsDarkMode }) => {
  const { transactions, loading: dataLoading } = useData();
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const filteredTransactions = (transactions || []).filter((tx) => {
    if (!dateRange.start && !dateRange.end) return true;
    const txDate = new Date(tx.rawDate);
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;
    if (start && txDate < start) return false;
    if (end && txDate > end) return false;
    return true;
  });

  const totalSpent = filteredTransactions.reduce(
    (sum, tx) => sum + Math.abs(tx.amount || 0),
    0,
  );
  const averageSpent =
    filteredTransactions.length > 0
      ? totalSpent / filteredTransactions.length
      : 0;
  const highestSpent = Math.max(
    ...filteredTransactions.map((tx) => Math.abs(tx.amount || 0)),
    0,
  );

  const categorySpending = {};
  filteredTransactions.forEach((tx) => {
    if (tx?.category) {
      categorySpending[tx.category] =
        (categorySpending[tx.category] || 0) + Math.abs(tx.amount || 0);
    }
  });

  const pieData = Object.entries(categorySpending).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || "#94A3B8",
  }));

  const monthlyData = {};
  filteredTransactions.forEach((tx) => {
    if (tx.rawDate) {
      const month = new Date(tx.rawDate).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
      monthlyData[month] = (monthlyData[month] || 0) + Math.abs(tx.amount || 0);
    }
  });

  const trendData = Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  const handleExportCSV = () => {
    const headers = ["Name", "Category", "Amount", "Date"];
    const rows = filteredTransactions.map((tx) => [
      tx.name || tx.description,
      tx.category,
      Math.abs(tx.amount || 0),
      tx.date,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `splitmate_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const theme = {
    bg: isDarkMode ? "#0A0F1E" : "#F1F5F9",
    card: isDarkMode ? "#111827" : "#FFFFFF",
    border: isDarkMode ? "#1E2D45" : "#E2E8F0",
    text: isDarkMode ? "#F1F5F9" : "#1E293B",
    secondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#3B82F6",
  };

  if (dataLoading) {
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
          Loading reports...
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
              Financial Reports
            </h1>
            <p
              style={{
                color: theme.secondary,
                margin: "4px 0 0 0",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Analyze your spending patterns
            </p>
          </div>
          <button
            onClick={handleExportCSV}
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
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Download size={18} /> Export Report
          </button>
        </div>

        <div
          className="animate-fadeInUp"
          style={{
            backgroundColor: theme.card,
            padding: "20px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <Calendar size={18} color={theme.secondary} />
            <span
              style={{ fontWeight: "700", fontFamily: "'Inter', sans-serif" }}
            >
              Filter by Date Range
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="hover-lift"
              style={{
                padding: "8px 12px",
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                color: theme.text,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <span style={{ color: theme.secondary }}>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="hover-lift"
              style={{
                padding: "8px 12px",
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: "8px",
                color: theme.text,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              onClick={() => setDateRange({ start: "", end: "" })}
              className="hover-scale"
              style={{
                background: `${theme.primary}20`,
                color: theme.primary,
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          {[
            {
              label: "Total Spent",
              value: `₹${totalSpent.toLocaleString("en-IN")}`,
              icon: <TrendingDown size={20} color="#F43F5E" />,
              color: "#F43F5E",
            },
            {
              label: "Average per Transaction",
              value: `₹${Math.round(averageSpent).toLocaleString("en-IN")}`,
              icon: <TrendingUp size={20} color="#10B981" />,
              color: "#10B981",
            },
            {
              label: "Highest Transaction",
              value: `₹${highestSpent.toLocaleString("en-IN")}`,
              icon: <TrendingUp size={20} color="#F59E0B" />,
              color: "#F59E0B",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="hover-lift"
              style={{
                backgroundColor: theme.card,
                padding: "24px",
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <p
                  style={{
                    color: theme.secondary,
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {card.label}
                </p>
                {card.icon}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  color: card.color,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {card.value}
              </h2>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "12px",
                  color: theme.secondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {filteredTransactions.length} transactions
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            className="animate-scaleIn"
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
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Spending Trend
            </h3>
            <div style={{ height: "300px" }}>
              {trendData.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: theme.secondary,
                  }}
                >
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.border}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
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
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={theme.primary}
                      strokeWidth={3}
                      dot={{ fill: theme.primary, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div
            className="animate-scaleIn"
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
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Category Breakdown
            </h3>
            <div style={{ height: "300px" }}>
              {pieData.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: theme.secondary,
                  }}
                >
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.card,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "10px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      formatter={(v) => [`₹${v}`, "Spent"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div
          className="animate-fadeInUp"
          style={{
            backgroundColor: theme.card,
            borderRadius: "20px",
            border: `1px solid ${theme.border}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontWeight: "700",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Transaction Details
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${theme.border}`,
                    background: `${theme.primary}08`,
                  }}
                >
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "right",
                      fontWeight: "700",
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 20).map((tx) => (
                  <tr
                    key={tx.id || tx._id}
                    style={{ borderBottom: `1px solid ${theme.border}` }}
                  >
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {tx.name || tx.description}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <span
                        style={{
                          background: `${CATEGORY_COLORS[tx.category] || "#94A3B8"}20`,
                          color: CATEGORY_COLORS[tx.category] || "#94A3B8",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {tx.category || "Other"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#F43F5E",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      ₹{Math.abs(tx.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        color: theme.secondary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {tx.date || "No date"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: theme.secondary,
                }}
              >
                No transactions found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;

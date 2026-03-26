import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import {
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
import API from "../utils/api";
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

const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Bills: "⚡",
  Entertainment: "🎬",
  Health: "💊",
  Shopping: "🛒",
  Other: "📦",
};

const Categories = ({ isDarkMode, setIsDarkMode }) => {
  const { transactions, refreshData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    limit: "",
    color: "#3B82F6",
    icon: "📦",
  });
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
    fetchCustomCategories();
  }, []);

  const fetchCustomCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCustomCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const categorySpending = {};
  (transactions || []).forEach((tx) => {
    if (tx?.category) {
      categorySpending[tx.category] =
        (categorySpending[tx.category] || 0) + Math.abs(tx.amount || 0);
    }
  });

  const allCategories = [
    ...Object.keys(CATEGORY_COLORS),
    ...customCategories.map((c) => c.name),
  ];
  const pieData = allCategories
    .filter((cat) => categorySpending[cat] > 0)
    .map((cat) => ({
      name: cat,
      value: categorySpending[cat],
      color:
        CATEGORY_COLORS[cat] ||
        customCategories.find((c) => c.name === cat)?.color ||
        "#94A3B8",
      icon:
        categoryIcons[cat] ||
        customCategories.find((c) => c.name === cat)?.icon ||
        "📦",
    }));

  const handleAddCategory = async () => {
    if (!form.name) return;
    try {
      await API.post("/categories", {
        name: form.name,
        limit: form.limit ? +form.limit : null,
        color: form.color,
        icon: form.icon || "📦",
      });
      setShowModal(false);
      setForm({ name: "", limit: "", color: "#3B82F6", icon: "📦" });
      fetchCustomCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (name) => {
    try {
      await API.delete(`/categories/${name}`);
      fetchCustomCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const theme = {
    bg: isDarkMode ? "#0A0F1E" : "#F1F5F9",
    card: isDarkMode ? "#111827" : "#FFFFFF",
    border: isDarkMode ? "#1E2D45" : "#E2E8F0",
    text: isDarkMode ? "#F1F5F9" : "#1E293B",
    secondary: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#3B82F6",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: theme.bg,
    border: `1px solid ${theme.border}`,
    borderRadius: "12px",
    color: theme.text,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    marginTop: "8px",
    fontFamily: "'Inter', sans-serif",
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
          Loading categories...
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
              Categories
            </h1>
            <p
              style={{
                color: theme.secondary,
                margin: "4px 0 0 0",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Manage your expense categories
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "28px",
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
              Spending by Category
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
                  No spending data yet
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
              Category Comparison
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
                  No spending data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieData}>
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
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {Object.keys(CATEGORY_COLORS).map((cat) => {
            const spent = categorySpending[cat] || 0;
            return (
              <div
                key={cat}
                className="hover-lift"
                style={{
                  backgroundColor: theme.card,
                  padding: "20px",
                  borderRadius: "16px",
                  border: `1px solid ${theme.border}`,
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
                  <div style={{ fontSize: "32px" }}>{categoryIcons[cat]}</div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "800",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {cat}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: theme.secondary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Default Category
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: CATEGORY_COLORS[cat],
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    ₹{spent.toLocaleString("en-IN")}
                  </span>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: theme.secondary,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Total spent this month
                </p>
              </div>
            );
          })}

          {customCategories.map((cat) => {
            const spent = categorySpending[cat.name] || 0;
            return (
              <div
                key={cat._id}
                className="hover-lift"
                style={{
                  backgroundColor: theme.card,
                  padding: "20px",
                  borderRadius: "16px",
                  border: `1px solid ${theme.border}`,
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
                  <div style={{ fontSize: "32px" }}>{cat.icon || "📦"}</div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "800",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: theme.secondary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Custom Category
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.name)}
                    className="hover-scale"
                    style={{
                      background: "#F43F5E20",
                      border: "none",
                      color: "#F43F5E",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: cat.color,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    ₹{spent.toLocaleString("en-IN")}
                  </span>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: cat.color,
                    }}
                  />
                </div>
                {cat.limit && (
                  <div style={{ marginTop: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Budget Limit
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        ₹{cat.limit.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: theme.border,
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min((spent / cat.limit) * 100, 100)}%`,
                          height: "100%",
                          background: spent > cat.limit ? "#F43F5E" : cat.color,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            className="animate-scaleIn"
            style={{
              background: theme.card,
              borderRadius: "24px",
              padding: "32px",
              width: "420px",
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
                Add Custom Category
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g. Travel"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="hover-lift"
                style={inputStyle}
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
                Budget Limit (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                className="hover-lift"
                style={inputStyle}
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
                Color
              </label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "8px",
                  marginTop: "8px",
                  cursor: "pointer",
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
                Icon
              </label>
              <input
                type="text"
                placeholder="e.g. ✈️"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="hover-lift"
                style={inputStyle}
              />
            </div>
            <button
              onClick={handleAddCategory}
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
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

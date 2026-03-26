import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Bell, LogOut, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Budget", path: "/budget" },
  { label: "Categories", path: "/categories" },
  { label: "Recurring", path: "/recurring" },
  { label: "Goals", path: "/goals" },
  { label: "Insights", path: "/insights" },
  { label: "Reports", path: "/reports" },
  { label: "Activity", path: "/activity" },
  { label: "Settings", path: "/settings" },
];

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Netflix payment due in 2 days",
      time: "1h ago",
      read: false,
    },
    {
      id: 2,
      text: "You spent 40% more on Food this week",
      time: "3h ago",
      read: false,
    },
    {
      id: 3,
      text: "Goal: Emergency Fund reached 50%!",
      time: "1d ago",
      read: false,
    },
  ]);

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userInitial = userName.charAt(0).toUpperCase();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const theme = {
    card: isDarkMode ? "#111827" : "#FFFFFF",
    border: isDarkMode ? "#1E2D45" : "#E2E8F0",
    text: isDarkMode ? "#F1F5F9" : "#1E293B",
    secondary: isDarkMode ? "#94A3B8" : "#64748B",
    bg: isDarkMode ? "#0A0F1E" : "#F1F5F9",
    primary: "#3B82F6",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <nav
      style={{
        height: "70px",
        backgroundColor: theme.card,
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <h2
          style={{
            color: theme.primary,
            fontWeight: "900",
            margin: 0,
            fontSize: "22px",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
          onClick={() => navigate("/dashboard")}
        >
          SplitMate
        </h2>
        <div style={{ display: "flex", gap: "2px" }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                background:
                  location.pathname === item.path
                    ? `${theme.primary}20`
                    : "transparent",
                color:
                  location.pathname === item.path
                    ? theme.primary
                    : theme.secondary,
                border: "none",
                padding: "7px 11px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
              className="hover-scale"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="hover-scale"
          style={{
            background: "none",
            border: "none",
            color: theme.secondary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowUserMenu(false);
            }}
            className="hover-scale"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: theme.secondary,
              position: "relative",
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "#F43F5E",
                  color: "white",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div
              className="animate-scaleIn"
              style={{
                position: "absolute",
                right: 0,
                top: "40px",
                width: "320px",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "16px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${theme.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "14px",
                    color: theme.text,
                  }}
                >
                  Notifications
                </span>
                <button
                  onClick={markAllRead}
                  className="hover-scale"
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.primary,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Mark all read
                </button>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "14px 20px",
                    borderBottom: `1px solid ${theme.border}`,
                    background: n.read ? "transparent" : `${theme.primary}08`,
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: n.read ? "transparent" : theme.primary,
                      marginTop: "5px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: "600",
                        color: theme.text,
                      }}
                    >
                      {n.text}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "11px",
                        color: theme.secondary,
                      }}
                    >
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifs(false);
            }}
            className="hover-scale"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3B82F6, #1E3A5F)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {userInitial}
            </div>
            <span
              style={{ fontSize: "13px", fontWeight: "600", color: theme.text }}
            >
              {userName.split(" ")[0]}
            </span>
            <ChevronDown size={14} color={theme.secondary} />
          </button>
          {showUserMenu && (
            <div
              className="animate-scaleIn"
              style={{
                position: "absolute",
                right: 0,
                top: "48px",
                width: "200px",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: "14px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: "800",
                    fontSize: "14px",
                    color: theme.text,
                  }}
                >
                  {userName}
                </p>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "12px",
                    color: theme.secondary,
                  }}
                >
                  {userEmail}
                </p>
              </div>
              <button
                onClick={() => {
                  navigate("/settings");
                  setShowUserMenu(false);
                }}
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  color: theme.text,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                ⚙️ Settings
              </button>
              <button
                onClick={handleLogout}
                className="hover-lift"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  color: "#F43F5E",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {(showNotifs || showUserMenu) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 150 }}
          onClick={() => {
            setShowNotifs(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;

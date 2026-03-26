import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Database,
  Info,
  Upload,
  Trash2,
  Download,
  Save,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import API from "../utils/api";
import { useData } from "../context/DataContext";

const Settings = ({ isDarkMode, setIsDarkMode }) => {
  const { transactions, refreshData } = useData();
  const [activeSection, setActiveSection] = useState("Profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedMsg, setSavedMsg] = useState("✓ Changes saved!");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const photoInputRef = useRef(null);
  const importInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userPhone") || "",
  });

  const [prefs, setPrefs] = useState({
    currency: "₹ INR",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    theme: isDarkMode ? "Dark" : "Light",
  });
  const [notifs, setNotifs] = useState({
    budget: true,
    recurring: true,
    goals: false,
    email: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    setPrefs({ ...prefs, theme: isDarkMode ? "Dark" : "Light" });
  }, [isDarkMode]);

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

  const showSaved = (msg = "✓ Changes saved!") => {
    setSavedMsg(msg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveProfile = () => {
    localStorage.setItem("userName", profile.name);
    localStorage.setItem("userEmail", profile.email);
    localStorage.setItem("userPhone", profile.phone);
    showSaved("✓ Profile saved!");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      localStorage.setItem("userPhoto", ev.target.result);
      showSaved("✓ Photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwError("Please fill all fields.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setPwError("");
    setPasswords({ current: "", newPass: "", confirm: "" });
    showSaved("✓ Password updated!");
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const headers = ["Name", "Category", "Amount", "Date"];
    const rows = transactions.map((tx) => [
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
    a.download = `splitmate_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSaved("✓ CSV downloaded!");
  };

  const handleExportJSON = async () => {
    try {
      const goalsRes = await API.get("/goals");
      const budgetsRes = await API.get("/budgets");
      const owedRes = await API.get("/owed");
      const exportData = {
        transactions,
        goals: goalsRes.data,
        budgets: budgetsRes.data,
        owed: owedRes.data,
        profile: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        },
        prefs,
        notifs,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `splitmate_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showSaved("✓ JSON downloaded!");
    } catch (error) {
      alert("Failed to export data");
    }
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.trim().split("\n").slice(1);
        const categoryIcons = {
          Food: "🍔",
          Transport: "🚗",
          Bills: "⚡",
          Entertainment: "🎬",
          Health: "💊",
          Shopping: "🛒",
          Other: "📦",
        };
        const imported = lines
          .map((line, idx) => {
            const parts = line.split(",");
            const category = parts[1]?.trim() || "Other";
            return {
              description:
                parts[0]?.replace(/"/g, "").trim() || `Imported ${idx + 1}`,
              amount: parseFloat(parts[2]) || 0,
              category,
              date: parts[3]?.trim() || new Date().toISOString().split("T")[0],
              icon: categoryIcons[category] || "📦",
            };
          })
          .filter((e) => e.description && !isNaN(e.amount) && e.amount > 0);

        Promise.all(imported.map((tx) => API.post("/expenses", tx))).then(
          () => {
            refreshData();
            showSaved(`✓ ${imported.length} transactions imported!`);
          },
        );
        e.target.value = "";
      } catch {
        alert("Failed to parse CSV. Please use the correct format.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    try {
      const expenses = await API.get("/expenses");
      await Promise.all(
        expenses.data.map((tx) => API.delete(`/expenses/${tx.id || tx._id}`)),
      );
      refreshData();
      setShowClearConfirm(false);
      showSaved("✓ All transactions cleared!");
    } catch (error) {
      alert("Failed to clear transactions");
    }
  };

  const sections = [
    { label: "Profile", icon: User },
    { label: "Account", icon: Lock },
    { label: "Preferences", icon: "⚙️" },
    { label: "Notifications", icon: Bell },
    { label: "Data", icon: Database },
    { label: "About", icon: Info },
  ];

  const Toggle = ({ on, onToggle }) => (
    <div
      onClick={onToggle}
      className="hover-scale"
      style={{
        width: "46px",
        height: "24px",
        borderRadius: "12px",
        background: on ? theme.primary : theme.border,
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "3px",
          left: on ? "25px" : "3px",
          transition: "left 0.2s",
        }}
      />
    </div>
  );

  const Section = ({ children }) => (
    <div
      style={{
        backgroundColor: theme.card,
        borderRadius: "20px",
        border: `1px solid ${theme.border}`,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );

  const SectionHeader = ({ title, sub }) => (
    <div
      style={{
        padding: "24px 28px",
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontWeight: "800",
          fontSize: "17px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {title}
      </h3>
      {sub && (
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: "13px",
            color: theme.secondary,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );

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

      {saved && (
        <div
          className="animate-pulse"
          style={{
            position: "fixed",
            top: "90px",
            right: "32px",
            background: "#10B981",
            color: "white",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "700",
            zIndex: 500,
            boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {savedMsg}
        </div>
      )}

      <main style={{ padding: "36px 40px" }}>
        <div className="animate-fadeInUp" style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Settings
          </h1>
          <p
            style={{
              color: theme.secondary,
              margin: "4px 0 0 0",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Manage your account and app preferences
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              backgroundColor: theme.card,
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
              padding: "8px",
            }}
          >
            {sections.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveSection(label)}
                className="hover-lift"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  background:
                    activeSection === label
                      ? `${theme.primary}20`
                      : "transparent",
                  color:
                    activeSection === label ? theme.primary : theme.secondary,
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "14px",
                  textAlign: "left",
                  marginBottom: "2px",
                  transition: "all 0.15s",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {typeof Icon === "string" ? (
                  <span>{Icon}</span>
                ) : (
                  <Icon size={16} />
                )}
                {label}
              </button>
            ))}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {activeSection === "Profile" && (
              <Section>
                <SectionHeader
                  title="Profile Information"
                  sub="Update your personal details"
                />
                <div style={{ padding: "28px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      marginBottom: "28px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "28px",
                        fontWeight: "900",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        profile.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                      />
                      <button
                        onClick={() => photoInputRef.current.click()}
                        className="hover-glow"
                        style={{
                          background: `${theme.primary}20`,
                          color: theme.primary,
                          border: `1px solid ${theme.primary}40`,
                          padding: "8px 16px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <Upload size={14} /> Upload Photo
                      </button>
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          fontSize: "12px",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    {[
                      { label: "Full Name", key: "name", type: "text" },
                      { label: "Phone Number", key: "phone", type: "tel" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: theme.secondary,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {f.label}
                        </label>
                        <input
                          type={f.type}
                          value={profile[f.key]}
                          onChange={(e) =>
                            setProfile({ ...profile, [f.key]: e.target.value })
                          }
                          className="hover-lift"
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: theme.secondary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="hover-lift"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="hover-glow"
                    style={{
                      background: theme.primary,
                      color: "white",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <Save size={16} /> Save Profile
                  </button>
                </div>
              </Section>
            )}

            {activeSection === "Account" && (
              <Section>
                <SectionHeader
                  title="Account & Security"
                  sub="Change your password or delete your account"
                />
                <div style={{ padding: "28px" }}>
                  <h4
                    style={{
                      margin: "0 0 16px 0",
                      fontWeight: "700",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Change Password
                  </h4>
                  {[
                    { label: "Current Password", key: "current" },
                    { label: "New Password", key: "newPass" },
                    { label: "Confirm New Password", key: "confirm" },
                  ].map((f) => (
                    <div key={f.key} style={{ marginBottom: "14px" }}>
                      <label
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {f.label}
                      </label>
                      <input
                        type="password"
                        value={passwords[f.key]}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            [f.key]: e.target.value,
                          })
                        }
                        className="hover-lift"
                        style={inputStyle}
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                  {pwError && (
                    <p
                      style={{
                        color: "#F43F5E",
                        fontSize: "13px",
                        fontWeight: "600",
                        margin: "0 0 12px 0",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {pwError}
                    </p>
                  )}
                  <button
                    onClick={handlePasswordChange}
                    className="hover-glow"
                    style={{
                      background: theme.primary,
                      color: "white",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginBottom: "32px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Update Password
                  </button>
                  <div
                    style={{
                      borderTop: `1px solid ${theme.border}`,
                      paddingTop: "24px",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontWeight: "700",
                        color: "#F43F5E",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Danger Zone
                    </h4>
                    <p
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "13px",
                        color: theme.secondary,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Once deleted, your account cannot be recovered.
                    </p>
                    {showDeleteConfirm ? (
                      <div
                        style={{
                          background: "#F43F5E15",
                          border: "1px solid #F43F5E40",
                          padding: "16px",
                          borderRadius: "12px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            fontWeight: "600",
                            color: "#F43F5E",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          Are you sure? This action is irreversible.
                        </p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            className="hover-glow"
                            style={{
                              background: "#F43F5E",
                              color: "white",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Yes, Delete Account
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="hover-scale"
                            style={{
                              background: theme.border,
                              color: theme.secondary,
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="hover-glow"
                        style={{
                          background: "#F43F5E20",
                          color: "#F43F5E",
                          border: "1px solid #F43F5E40",
                          padding: "10px 20px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <Trash2 size={15} /> Delete My Account
                      </button>
                    )}
                  </div>
                </div>
              </Section>
            )}

            {activeSection === "Preferences" && (
              <Section>
                <SectionHeader
                  title="App Preferences"
                  sub="Customize your SplitMate experience"
                />
                <div style={{ padding: "28px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    {[
                      {
                        label: "Currency",
                        key: "currency",
                        options: ["₹ INR", "$ USD", "€ EUR", "£ GBP"],
                      },
                      {
                        label: "Language",
                        key: "language",
                        options: ["English", "Telugu", "Hindi", "Tamil"],
                      },
                      {
                        label: "Date Format",
                        key: "dateFormat",
                        options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
                      },
                      {
                        label: "Theme",
                        key: "theme",
                        options: ["Dark", "Light", "System"],
                      },
                    ].map((f) => (
                      <div key={f.key}>
                        <label
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: theme.secondary,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {f.label}
                        </label>
                        <select
                          value={prefs[f.key]}
                          onChange={(e) => {
                            setPrefs({ ...prefs, [f.key]: e.target.value });
                            if (f.key === "theme" && e.target.value === "Dark")
                              setIsDarkMode(true);
                            if (f.key === "theme" && e.target.value === "Light")
                              setIsDarkMode(false);
                          }}
                          className="hover-lift"
                          style={inputStyle}
                        >
                          {f.options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => showSaved("✓ Preferences saved!")}
                    className="hover-glow"
                    style={{
                      background: theme.primary,
                      color: "white",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginTop: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <Save size={16} /> Save Preferences
                  </button>
                </div>
              </Section>
            )}

            {activeSection === "Notifications" && (
              <Section>
                <SectionHeader
                  title="Notification Settings"
                  sub="Control what alerts you receive"
                />
                {[
                  {
                    key: "budget",
                    label: "Budget Limit Alerts",
                    sub: "Get notified when you're close to your budget limit",
                  },
                  {
                    key: "recurring",
                    label: "Recurring Payment Reminders",
                    sub: "Get reminded 3 days before a recurring payment is due",
                  },
                  {
                    key: "goals",
                    label: "Goal Milestone Alerts",
                    sub: "Celebrate when you hit 25%, 50%, 75%, and 100% of your goals",
                  },
                  {
                    key: "email",
                    label: "Email Notifications",
                    sub: "Receive monthly summaries and important alerts via email",
                  },
                ].map((item, idx, arr) => (
                  <div
                    key={item.key}
                    style={{
                      padding: "20px 28px",
                      borderBottom:
                        idx < arr.length - 1
                          ? `1px solid ${theme.border}`
                          : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                        {item.label}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "12px",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {item.sub}
                      </p>
                    </div>
                    <Toggle
                      on={notifs[item.key]}
                      onToggle={() =>
                        setNotifs({ ...notifs, [item.key]: !notifs[item.key] })
                      }
                    />
                  </div>
                ))}
              </Section>
            )}

            {activeSection === "Data" && (
              <Section>
                <SectionHeader
                  title="Data Management"
                  sub="Export, import, or clear your financial data"
                />
                <div
                  style={{
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    className="hover-lift"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      background: "#10B98106",
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
                        Export all data as CSV
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "12px",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Download a spreadsheet-compatible export — opens in
                        Excel
                      </p>
                    </div>
                    <button
                      onClick={handleExportCSV}
                      className="hover-scale"
                      style={{
                        background: "#10B98120",
                        color: "#10B981",
                        border: "1px solid #10B98140",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexShrink: 0,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <Download size={14} /> Export CSV
                    </button>
                  </div>
                  <div
                    className="hover-lift"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      background: "#3B82F606",
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
                        Export all data as JSON
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "12px",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Download a complete backup of your SplitMate data
                      </p>
                    </div>
                    <button
                      onClick={handleExportJSON}
                      className="hover-scale"
                      style={{
                        background: "#3B82F620",
                        color: "#3B82F6",
                        border: "1px solid #3B82F640",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexShrink: 0,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <Download size={14} /> Export JSON
                    </button>
                  </div>
                  <div
                    className="hover-lift"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                      background: "#F59E0B06",
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
                        Import transactions from CSV
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "12px",
                          color: theme.secondary,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Upload a CSV file to bulk-import your transactions
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      ref={importInputRef}
                      onChange={handleImportCSV}
                      style={{ display: "none" }}
                    />
                    <button
                      onClick={() => importInputRef.current.click()}
                      className="hover-scale"
                      style={{
                        background: "#F59E0B20",
                        color: "#F59E0B",
                        border: "1px solid #F59E0B40",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexShrink: 0,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <Upload size={14} /> Import CSV
                    </button>
                  </div>
                  <div
                    style={{
                      borderTop: `1px solid ${theme.border}`,
                      paddingTop: "16px",
                    }}
                  >
                    {showClearConfirm ? (
                      <div
                        style={{
                          background: "#F43F5E15",
                          border: "1px solid #F43F5E40",
                          padding: "16px",
                          borderRadius: "12px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            fontWeight: "600",
                            color: "#F43F5E",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          This will permanently delete all your transactions.
                          Are you sure?
                        </p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={handleClearAll}
                            className="hover-glow"
                            style={{
                              background: "#F43F5E",
                              color: "white",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Yes, Clear All
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="hover-scale"
                            style={{
                              background: theme.border,
                              color: theme.secondary,
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="hover-glow"
                        style={{
                          background: "#F43F5E20",
                          color: "#F43F5E",
                          border: "1px solid #F43F5E40",
                          padding: "10px 20px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <Trash2 size={15} /> Clear All Transactions
                      </button>
                    )}
                  </div>
                </div>
              </Section>
            )}

            {activeSection === "About" && (
              <Section>
                <SectionHeader title="About SplitMate" />
                <div style={{ padding: "28px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "28px",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #3B82F6, #1E3A5F)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "900",
                        fontSize: "22px",
                      }}
                    >
                      S
                    </div>
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontWeight: "900",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        SplitMate
                      </h2>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: theme.secondary,
                          fontSize: "14px",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        AI-Powered Personal Finance Manager
                      </p>
                    </div>
                  </div>
                  {[
                    { label: "Version", value: "1.0.0" },
                    { label: "Built with", value: "React + Node.js (MERN)" },
                    { label: "Developer", value: "Veda Shiva Prasad" },
                    { label: "GitHub", value: "github.com/Veda-Shiva-Prasad" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 0",
                        borderBottom: `1px solid ${theme.border}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: theme.secondary,
                          fontWeight: "600",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{ display: "flex", gap: "16px", marginTop: "24px" }}
                  >
                    <button
                      className="hover-scale"
                      style={{
                        background: `${theme.primary}15`,
                        color: theme.primary,
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Privacy Policy
                    </button>
                    <button
                      className="hover-scale"
                      style={{
                        background: `${theme.primary}15`,
                        color: theme.primary,
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Terms of Use
                    </button>
                  </div>
                </div>
              </Section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

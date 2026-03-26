import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import API from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const keysToKeep = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("splitmate_"))
          keysToKeep.push({ key, value: localStorage.getItem(key) });
      }
      localStorage.clear();
      keysToKeep.forEach(({ key, value }) => localStorage.setItem(key, value));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "userName",
        res.data.user?.name || res.data.name || "User",
      );
      localStorage.setItem("userEmail", res.data.user?.email || email);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div
        style={{
          ...styles.card,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div className="animate-bounceIn">
          <h2 style={styles.title}>SplitMate</h2>
          <p style={styles.subtitle}>Securely manage your shared expenses</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup} className="animate-slideInLeft">
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="hover-lift"
              />
            </div>
          </div>
          <div style={styles.inputGroup} className="animate-slideInRight">
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type={showPassword ? "text" : "password"}
                style={styles.input}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="hover-lift"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                className="hover-scale"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" style={styles.button} className="hover-glow">
            Sign In
          </button>
        </form>
        <p style={styles.footerText} className="animate-fadeIn">
          New here?{" "}
          <Link to="/register" style={styles.link} className="hover-scale">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const animations = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { opacity: 0.9; transform: scale(1.05); }
    80% { transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  .hover-scale {
    transition: transform 0.2s ease;
  }
  .hover-scale:hover {
    transform: scale(1.05);
  }
  .hover-glow {
    transition: all 0.3s ease;
  }
  .hover-glow:hover {
    box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
    transform: translateY(-2px);
  }
  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out forwards;
  }
  .animate-slideInRight {
    animation: slideInRight 0.5s ease-out forwards;
  }
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  .animate-bounceIn {
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(-45deg, #eef2ff, #e0e7ff, #f3f4f6)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 10s ease infinite",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "28px",
    boxShadow: "0 20px 50px rgba(79, 70, 229, 0.15)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    border: "1px solid #fff",
  },
  title: {
    color: "#4f46e5",
    fontSize: "36px",
    fontWeight: "900",
    margin: "0 0 8px 0",
    letterSpacing: "-1.5px",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "32px",
    fontSize: "14px",
    fontWeight: "500",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { textAlign: "left" },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "800",
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "14px", color: "#94a3b8" },
  input: {
    width: "100%",
    padding: "14px 45px",
    borderRadius: "14px",
    border: "1.5px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s",
  },
  eyeBtn: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
  },
  button: {
    padding: "16px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)",
    transition: "all 0.3s",
    marginTop: "10px",
  },
  footerText: { marginTop: "24px", fontSize: "14px", color: "#64748b" },
  link: { color: "#4f46e5", fontWeight: "800", textDecoration: "none" },
};

export default Login;

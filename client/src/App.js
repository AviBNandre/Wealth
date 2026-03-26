import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Budget from "./pages/Budget";
import Categories from "./pages/Categories";
import Recurring from "./pages/Recurring";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Reports from "./pages/Reports";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import "./index.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("splitmate_theme");
    return saved !== null ? saved === "dark" : true;
  });

  const handleThemeToggle = (val) => {
    setIsDarkMode(val);
    localStorage.setItem("splitmate_theme", val ? "dark" : "light");
  };

  const themeProps = { isDarkMode, setIsDarkMode: handleThemeToggle };

  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard {...themeProps} />} />
          <Route path="/budget" element={<Budget {...themeProps} />} />
          <Route path="/categories" element={<Categories {...themeProps} />} />
          <Route path="/recurring" element={<Recurring {...themeProps} />} />
          <Route path="/goals" element={<Goals {...themeProps} />} />
          <Route path="/insights" element={<Insights {...themeProps} />} />
          <Route path="/reports" element={<Reports {...themeProps} />} />
          <Route path="/activity" element={<Activity {...themeProps} />} />
          <Route path="/settings" element={<Settings {...themeProps} />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RangerDashboard from "./pages/RangerDashboard"; // Import new dashboard
import ReportSighting from "./pages/ReportSighting";
import Alerts from "./pages/Alerts";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import DriveMode from "./pages/DriveMode";
import Success from "./pages/Success";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., waiting for assets or auth check)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ThemeProvider>
        <Router>
          <Splash />
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportSighting />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} /> {/* <-- Add this line */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/drive" element={<DriveMode />} />
          <Route path="/success" element={<Success />} />

          {/* Ranger Routes */}
          <Route path="/ranger-dashboard" element={<RangerDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
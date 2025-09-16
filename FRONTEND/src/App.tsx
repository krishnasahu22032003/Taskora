import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pending from "./pages/Pending";
import Complete from "./pages/Complete";
import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

import type { User } from "./types/types";

const API_URL = "http://localhost:5000";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Fetch current user from backend
  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/me`, {
        withCredentials: true,
      });
      if (data.success) setCurrentUser(data.user);
      else setCurrentUser(null);
    } catch (err) {
      setCurrentUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // After login, fetch current user
  const handleLogin = async () => {
    await fetchCurrentUser();
    navigate("/dashboard", { replace: true });
  };

  // After signup, redirect to login
  const handleSignUp = () => {
    navigate("/login");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/user/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const ProtectedLayout: React.FC = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  if (loadingAuth) return null; // prevent flash

  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/signup"
        element={<SignUp onSubmit={handleSignUp} onSwitchMode={() => navigate("/login")} />}
      />

      <Route
        path="/login"
        element={<Login onSubmit={handleLogin} onSwitchMode={() => navigate("/signup")} />}
      />

      {/* Protected routes */}
      <Route element={currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pending" element={<Pending />} />
        <Route path="complete" element={<Complete />} />
        <Route
          path="profile"
          element={<Profile user={currentUser!} setCurrentUser={setCurrentUser} onLogout={handleLogout} />}
        />
      </Route>

      <Route path="*" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

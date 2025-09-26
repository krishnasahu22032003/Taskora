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
import "./index.css";

axios.defaults.withCredentials = true; // ✅ allow cookies

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ check if user already logged in (cookie session)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me");
        if (res.data.success) {
          setCurrentUser(res.data.user);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ after login success → fetch user
  const handleAuthSubmit = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me");
      if (res.data.success) {
        setCurrentUser(res.data.user);
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Failed to fetch user after signin:", err);
    }
  };

  // ✅ logout → clear cookie & reset state
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCurrentUser(null);
      navigate("/login", { replace: true });
    }
  };

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-950 to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-fuchsia-400"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-fuchsia-950 to-gray-950 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      {/* Signup → redirect to login after success */}
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-fuchsia-950 to-gray-950 flex items-center justify-center">
            <SignUp
              onSubmit={() => navigate("/login")}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          currentUser ? (
            <ProtectedLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pending" element={<Pending />} />
        <Route path="complete" element={<Complete />} />
        <Route
          path="profile"
          element={
            <Profile
              user={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
            />
          }
        />
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;

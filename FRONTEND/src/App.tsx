import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pending from "./pages/Pending";
import Complete from "./pages/Complete";
import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Cookies from "js-cookie";
import "./index.css";
import type { User } from "./types/types";

const App: React.FC = () => {
  const navigate = useNavigate();

  // Load currentUser and token from cookies
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = Cookies.get("currentUser");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => Cookies.get("token") || null);

  // Sync currentUser with cookies
  useEffect(() => {
    if (currentUser) {
      Cookies.set("currentUser", JSON.stringify(currentUser), { expires: 7 });
    } else {
      Cookies.remove("currentUser");
    }
  }, [currentUser]);

  // Sync token with cookies
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 7 });
    } else {
      Cookies.remove("token");
    }
  }, [token]);

  // After login: store user and token
  const handleLogin = (user: User) => {
    const userToStore: User = {
      ...user,
      avatar:
        user.avatar ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.name ?? "User"
        )}&background=random`,
    };
    setCurrentUser(userToStore);
    if (user.token) setToken(user.token);

    navigate("/dashboard", { replace: true });
  };

  // After signup: redirect to login (do not auto-login)
  const handleSignUp = (_user: User) => {
    navigate("/login");
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  // Protected Layout wrapper
  const ProtectedLayout: React.FC = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    <Routes>
      {/* Root route → redirect based on login status */}
      <Route
        path="/"
        element={
          token && currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />

      {/* Public routes */}
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp onSubmit={handleSignUp} onSwitchMode={() => navigate("/login")} />
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login onSubmit={handleLogin} onSwitchMode={() => navigate("/signup")} />
          </div>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          token && currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
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

      {/* Fallback route */}
      <Route
        path="*"
        element={<Navigate to={token && currentUser ? "/dashboard" : "/signup"} replace />}
      />
    </Routes>
  );
};

export default App;

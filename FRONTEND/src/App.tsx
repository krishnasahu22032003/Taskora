import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";

function App() {
  const navigate = useNavigate();
  const [currentUser, setcurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: ''
    };
    setcurrentUser(user);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setcurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet />
      </Layout>
    );
  };

  return (
    <Routes>
      <Route
        path='/login'
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            {/* You can render your login form here */}
          </div>
        }
      />
      <Route path='/' element={<ProtectedLayout />}>
        {/* Nested routes can go here */}
      </Route>
    </Routes>
  );
}

export default App;

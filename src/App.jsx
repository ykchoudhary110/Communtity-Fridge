// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import FridgeList from "./pages/FridgeList";
import FridgeDetail from "./pages/FridgeDetail";
import EditFridge from "./pages/EditFridge";
import AdminAddFridge from "./pages/AdminAddFridge";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * NavBarInner - uses hooks (must be inside Router)
 * shows Home (with icon), Add Fridge (with icon), and user email with sign-out menu
 */
function NavBarInner() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  function handleSignOut() {
    signOut();
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <span style={{ fontSize: 18 }}>🏠</span>
            <span>Home</span>
          </Link>

          <Link to="/admin" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <span style={{ fontSize: 14 }}>➕</span>
            <span>Add Fridge</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
              <Link to="/signup" className="text-sm text-gray-700 hover:underline">Sign up</Link>
            </>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 px-3 py-1 border rounded bg-gray-50"
              >
                <span>📧</span>
                <span className="text-sm text-gray-700">{user.email}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-20">
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/"); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <div className="border-t" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavBar() {
  // small wrapper to allow hooks usage inside Router
  return <NavBarInner />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main>
            <Routes>
              {/* Protected: require login */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <FridgeList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fridge/:id"
                element={
                  <ProtectedRoute>
                    <FridgeDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fridge/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditFridge />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminAddFridge />
                  </ProtectedRoute>
                }
              />

              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Fallback -> protected home */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <FridgeList />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

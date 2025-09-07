import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./components/ToastProvider";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    // top-level routing
    <BrowserRouter basename="/iSearch">
      <AuthProvider>
        <ToastProvider>
          <Navbar />

          {/* route config */}
          <Routes>
            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

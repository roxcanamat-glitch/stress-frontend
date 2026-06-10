import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestAnsiedad from "../pages/TestAnsiedad";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../routes/ProtectedRoute";
import Home from "../pages/Home";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/test-ansiedad" element={<TestAnsiedad />} />

        {/* 🔒 RUTA PROTEGIDA */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
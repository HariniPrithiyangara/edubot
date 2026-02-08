import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Logout from "./pages/Logout";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword"; // ✅ New

// Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // 🔍 Backend Health Check & Auto-Discovery
  useEffect(() => {
    const checkBackend = async () => {
      // 1. Get all potential URLs from env
      const localUrl = import.meta.env.VITE_API_URL_LOCAL;
      const prodUrl = import.meta.env.VITE_API_URL_PROD;

      console.log("🔍 Checking Backends...");

      // Helper function to test a URL
      const testUrl = async (url) => {
        if (!url) return false;
        try {
          const res = await fetch(`${url}/`);
          return res.ok;
        } catch (e) {
          return false;
        }
      };

      // 2. Try Localhost First (Priority)
      if (await testUrl(localUrl)) {
        window.API_URL = localUrl;
        console.log(`✅ Using LOCAL Backend: ${localUrl}`);
        toast.success(`Connected to LOCAL Backend:\n${localUrl}`);
        return;
      }

      // 3. Try Production Second (Fallback)
      if (await testUrl(prodUrl)) {
        window.API_URL = prodUrl;
        console.log(`✅ Using PROD Backend: ${prodUrl}`);
        toast.success(`Connected to PROD Backend:\n${prodUrl}`);
        return;
      }

      // 4. Both Failed
      console.error("❌ No Backend Reachable");
      window.API_URL = prodUrl; // Default to prod even if failed
      toast.error("❌ Could not connect to any backend!");
    };

    checkBackend();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Added */}

        {/* Protected Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

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
  // 🔍 Backend Health Check
  useEffect(() => {
    const checkBackend = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log(`🔌 Connecting to Backend: ${apiUrl}`);

      try {
        const res = await fetch(`${apiUrl}/`);
        if (res.ok) {
          console.log("✅ Backend Connected!");
          toast.success(`Connected to Backend:\n${apiUrl}`, { duration: 4000 });
        } else {
          throw new Error("Backend reachable but returned error");
        }
      } catch (err) {
        console.error("❌ Backend Connection Failed", err);
        toast.error(`backend connection failed:\n${apiUrl}\nCheck console for details.`, { duration: 6000 });
      }
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

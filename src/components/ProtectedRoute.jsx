import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  let user = null;

  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser || rawUser === "undefined") {
      throw new Error("User not found or invalid");
    }

    user = JSON.parse(rawUser);

    // Optional: validate structure
    if (!user?.name || !user?.email) {
      throw new Error("Incomplete user object");
    }

  } catch (err) {
    console.error("Error parsing user:", err.message);
    localStorage.removeItem("user"); // clean up if corrupted
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

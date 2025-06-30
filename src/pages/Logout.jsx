import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🧹 Clear user data (optional: clear localStorage or context)
    localStorage.clear(); // if you're storing tokens or user info

    // ⛔ Redirect to login
    navigate("/");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;

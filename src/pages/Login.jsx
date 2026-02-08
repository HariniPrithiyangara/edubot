import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const apiUrl = window.API_URL || import.meta.env.VITE_API_URL_PROD;
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Store user
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        token: data.token,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      navigate("/chat");
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = window.API_URL || import.meta.env.VITE_API_URL_PROD;
    const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });

    const data = await res.json();
    setForgotMessage(data.message || "Something went wrong");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#111] text-white px-4">
      <div className="w-full max-w-md bg-[#1f1f1f] rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            <div className="text-4xl font-semibold">EduBot</div>
          </div>
          <p className="text-sm text-gray-400">Sign in to continue chatting</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => {
                setForgotMessage("");
                setForgotOpen(true);
              }}
              className="text-sm text-purple-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>

      {/* 🔐 Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#1f1f1f] w-full max-w-sm p-6 rounded-2xl shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setForgotOpen(false)}
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">Reset Your Password</h3>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-xl bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold"
              >
                Send Reset Link
              </button>
            </form>
            {forgotMessage && (
              <p className="text-sm text-center text-green-400 mt-4">{forgotMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

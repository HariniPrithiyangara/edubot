import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// DiceBear avatar seeds
const avatarSeeds = [
  "neo", "nova", "pixel", "cyberkid", "glitch",
  "zara", "kai", "lumi", "skye", "dash"
];
const getAvatarUrl = (seed) =>
  `https://api.dicebear.com/8.x/adventurer/svg?seed=${seed}`;

// 🔐 Change Password Modal
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://edubot-backend-3.onrender.com/api/user/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Password changed!");
      setOldPassword("");
      setNewPassword("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1f1f1f] rounded-2xl p-6 w-full max-w-md text-white space-y-4">
        <h3 className="text-xl font-semibold mb-2">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#2a2a2a] rounded-xl"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#2a2a2a] rounded-xl"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-medium"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ⚙️ Settings Component
const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // initially null
  const [initialUser, setInitialUser] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [pushNotif, setPushNotif] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) throw new Error("No user");

      const parsed = JSON.parse(raw);
      if (!parsed?.name || !parsed?.email) throw new Error("Invalid user data");

      setUser(parsed);
      setInitialUser(parsed);
    } catch (err) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      navigate("/login");
    }

    const theme = localStorage.getItem("darkMode");
    if (theme) setDarkMode(theme === "true");
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "https://edubot-backend-3.onrender.com/api/user/update-profile",
        {
          name: user.name,
          email: user.email,
          avatar: user.avatar || getAvatarUrl("neo"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setInitialUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadData = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edubot-user-data.json";
    link.click();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("https://edubot-backend-3.onrender.com/api/user/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  // ⛔️ Prevent access to user props before data is loaded
  if (!user || !initialUser) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }

  const hasChanges =
    user.name.trim() !== initialUser.name.trim() ||
    user.email.trim() !== initialUser.email.trim() ||
    user.avatar !== initialUser.avatar;

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-8">
      <button
        onClick={() => navigate("/chat")}
        className="mb-6 flex items-center gap-2 text-purple-400 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Chat
      </button>

      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-sm text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">Profile</h3>
          <img
            src={user.avatar || getAvatarUrl("neo")}
            alt="Avatar"
            className="h-20 w-20 rounded-full border-4 border-purple-500"
          />
          <div className="grid grid-cols-5 gap-3 mt-4">
            {avatarSeeds.map((seed) => {
              const url = getAvatarUrl(seed);
              return (
                <img
                  key={seed}
                  src={url}
                  alt={seed}
                  onClick={() => setUser({ ...user, avatar: url })}
                  className={`h-14 w-14 rounded-full border-2 cursor-pointer ${
                    user.avatar === url ? "border-purple-500" : "border-gray-600"
                  }`}
                />
              );
            })}
          </div>

          <div className="space-y-2 mt-6">
            <label className="text-sm text-gray-300">Display Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] px-4 py-2 rounded-xl"
            />
            <label className="text-sm text-gray-300 mt-4">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-[#2a2a2a] px-4 py-2 rounded-xl"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">Notifications</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Push Notifications</span>
            <input
              type="checkbox"
              checked={pushNotif}
              onChange={() => setPushNotif(!pushNotif)}
              className="w-5 h-5 accent-purple-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Sound Effects</span>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={() => setSoundEffects(!soundEffects)}
              className="w-5 h-5 accent-purple-500"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => {
                setDarkMode(!darkMode);
                localStorage.setItem("darkMode", !darkMode);
              }}
              className="w-5 h-5 accent-purple-500"
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1e1e1e] rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-semibold">Privacy & Security</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium"
            >
              Change Password
            </button>
            <button
              onClick={handleDownloadData}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium"
            >
              Download Data
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 rounded-xl text-sm font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className={`w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold ${
            (!hasChanges || isLoading) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Settings;
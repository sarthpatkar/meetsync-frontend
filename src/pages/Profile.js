// src/pages/Profile.js
import React, { useState } from "react";
import api from "../api/axiosConfig";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || ""); // ✅ Store avatar

  // ✅ Avatar initials fallback
  const initials = username ? username.charAt(0).toUpperCase() : "U";

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    toast.info("👋 Logged out");
    navigate("/login");
  };

  // ✅ Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("avatar", reader.result); // persist
        toast.success("Avatar updated!");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(" Please upload a valid image file.");
    }
  };

  // ✅ Profile update (username or password)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/users/${user.id}`,
        {
          username: username,
          password: password || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Save new token and updated user from backend response
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: res.data.userId, username: res.data.username })
        );
      }

      toast.success("Profile updated successfully!");
      setPassword("");
      navigate("/dashboard"); // optional: go back to dashboard immediately
    } catch (err) {
      console.error(" Error updating profile:", err.response?.data || err.message);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9]">
      {/* 🔹 Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 border-b border-black shadow-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex justify-between items-center py-4">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "Inter, sans-serif", color: "#FF2D2D" }}
          >
            MeetSync
          </h2>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-white text-black border border-black font-medium"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-[#FF2D2D] text-white border border-black font-medium"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* 🔹 Profile Content */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/50 border border-black rounded-2xl shadow-xl p-10 w-full max-w-lg"
          style={{
            boxShadow: "8px 8px 0px #000000",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
            className="relative w-24 h-24 mx-auto mb-6 rounded-full border-2 border-black shadow-md overflow-hidden flex items-center justify-center bg-[#FF2D2D]"
            style={{ boxShadow: "4px 4px 0px #000000" }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">{initials}</span>
            )}
            {/* Avatar Upload Input */}
            <label className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 rounded cursor-pointer">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </motion.div>

          <h2
            className="text-3xl font-extrabold text-center mb-8"
            style={{ color: "#FF2D2D" }}
          >
            Profile Settings
          </h2>

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Username */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block font-medium mb-1 text-black">
                Update Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded border border-black bg-white text-black placeholder-gray-500 focus:outline-none"
                style={{ boxShadow: "3px 3px 0px #000000" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block font-medium mb-1 text-black">
                Change Password (optional)
              </label>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-3 rounded border border-black bg-white text-black placeholder-gray-500 focus:outline-none"
                style={{ boxShadow: "3px 3px 0px #000000" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 bg-[#FF2D2D] text-white font-semibold border border-black"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Save Changes
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
export default Profile;
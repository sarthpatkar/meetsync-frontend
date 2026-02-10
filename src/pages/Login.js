// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // ✅ import toast
import api from "../api/axiosConfig";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: res.data.userId, username: res.data.username })
      );

      toast.success("Login successful!");
      navigate("/dashboard"); //  smooth redirect
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="h-screen w-full bg-[#FFF9F9] flex items-center justify-center">
      {/* Floating + hover animation on box */}
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="backdrop-blur-md bg-white/70 p-10 rounded-2xl w-[95%] max-w-lg border border-black"
        style={{
          boxShadow: "6px 6px 0px #000000",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h2
          className="text-3xl font-extrabold text-center mb-8"
          style={{ color: "#FF2D2D" }}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {/* Username input */}
          <motion.input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
            className="p-3 rounded border border-black bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2"
            style={{ boxShadow: "3px 3px 0px #000000" }}
          />

          {/* Password input */}
          <motion.input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
            className="p-3 rounded border border-black bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2"
            style={{ boxShadow: "3px 3px 0px #000000" }}
          />

          {/* Login button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-[#FF2D2D] text-white font-semibold border border-black"
            style={{ boxShadow: "4px 4px 0px #000000" }}
          >
            Login
          </motion.button>
        </form>

        <motion.p
          className="text-center text-black mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium hover:text-[#FF2D2D] underline"
          >
            Create one
          </Link>{" "}
          |{" "}
          <Link to="/" className="font-medium hover:text-[#FF2D2D] underline">
            ⬅ Back to Home
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;
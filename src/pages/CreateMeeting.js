// src/pages/CreateMeeting.js
import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // ✅ import toast

function CreateMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingMeeting = location.state?.meeting || null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participants, setParticipants] = useState("");

  const formatDateTime = (value) => (value ? value.slice(0, 16) : "");

  useEffect(() => {
    if (editingMeeting) {
      setTitle(editingMeeting.title);
      setDescription(editingMeeting.description);
      setMeetingLocation(editingMeeting.location || "");
      setStartTime(formatDateTime(editingMeeting.startTime));
      setEndTime(formatDateTime(editingMeeting.endTime));
    }
  }, [editingMeeting]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    toast.info("👋 Logged out successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      toast.error("❌ Please log in first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        title,
        description,
        location: meetingLocation,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        organizerId: user.id,
        participantEmails: participants
          ? participants.split(",").map((p) => p.trim())
          : [],
      };

      if (editingMeeting) {
        await api.put(`/meetings/${editingMeeting.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(" Meeting updated successfully!");
      } else {
        await api.post("/meetings", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Meeting created successfully!");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error saving meeting:", err.response?.data || err.message);
      toast.error("❌ Failed to save meeting: " + (err.response?.data?.message || err.message));
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

      {/* 🔹 Form Section */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/50 border border-black rounded-2xl shadow-xl p-10 w-full max-w-2xl"
          style={{
            boxShadow: "8px 8px 0px #000000",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <h2
            className="text-3xl font-extrabold text-center mb-8"
            style={{ color: "#FF2D2D" }}
          >
            {editingMeeting ? " Edit Meeting" : " Create Meeting"}
          </h2>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Title */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Meeting Title"
              className="w-full px-4 py-3 rounded border border-black bg-white/80 text-black placeholder-gray-500 focus:outline-none"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Description */}
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              placeholder="Description"
              className="w-full px-4 py-3 rounded border border-black bg-white/80 text-black placeholder-gray-500 focus:outline-none"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Location */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Meeting Location / Link"
              className="w-full px-4 py-3 rounded border border-black bg-white/80 text-black placeholder-gray-500 focus:outline-none"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
            />

            {/* Start Time */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 rounded border border-black bg-white/80 text-black focus:outline-none"
                style={{ boxShadow: "3px 3px 0px #000000" }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </motion.div>

            {/* End Time */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 rounded border border-black bg-white/80 text-black focus:outline-none"
                style={{ boxShadow: "3px 3px 0px #000000" }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </motion.div>

            {/* Participants */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Participant Emails (comma-separated)"
              className="w-full px-4 py-3 rounded border border-black bg-white/80 text-black placeholder-gray-500 focus:outline-none"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 mt-6 bg-[#FF2D2D] text-white font-semibold border border-black"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              {editingMeeting ? " Update Meeting" : " Create Meeting"}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateMeeting;
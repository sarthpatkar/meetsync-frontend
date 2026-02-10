// src/pages/Dashboard.js
import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { toast } from "react-toastify";
import "react-big-calendar/lib/css/react-big-calendar.css";

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [events, setEvents] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const avatar = localStorage.getItem("avatar") || "";
  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  const localizer = momentLocalizer(moment);
  const cardRefs = useRef({});

  // ✅ Fetch meetings
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/meetings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings(res.data);

      const meetingEvents = res.data.map((m) => ({
        id: m.id,
        title: m.title,
        start: new Date(m.startTime),
        end: new Date(m.endTime),
        allDay: false,
      }));
      setEvents(meetingEvents);
    } catch (err) {
      console.error(" Error fetching meetings:", err);
      toast.error(" Failed to fetch meetings");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // ✅ Delete meeting with toast confirmation
  const handleDelete = (id) => {
    toast.info(
      <div>
        <p className="font-medium mb-3"> Do you want to delete this meeting?</p>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                await api.delete(`/meetings/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.dismiss();
                toast.success(" Meeting deleted!");
                fetchMeetings();
              } catch (err) {
                console.error("Error deleting meeting:", err);
                toast.dismiss();
                toast.error(" Failed to delete meeting.");
              }
            }}
            className="px-3 py-1 bg-[#FF2D2D] text-white rounded border border-black"
            style={{ boxShadow: "2px 2px 0px #000000" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 text-black rounded border border-black"
            style={{ boxShadow: "2px 2px 0px #000000" }}
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleEdit = (meeting) => {
    navigate("/create-meeting", { state: { meeting } });
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    toast.info("👋 Logged out");
    navigate("/login");
  };

  // ✅ Calendar Event Click → scroll + highlight card
  const handleEventClick = (event) => {
    setHighlightedId(event.id);
    const card = cardRefs.current[event.id];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => setHighlightedId(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] relative">
      {/* 🔹 Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-black shadow-md">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex justify-between items-center py-4">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "Inter, sans-serif", color: "#FF2D2D" }}
          >
            MeetSync Dashboard
          </h2>

          {/* Avatar with dropdown */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full border-2 border-black shadow-md cursor-pointer overflow-hidden flex items-center justify-center bg-[#FF2D2D]"
              style={{ boxShadow: "3px 3px 0px #000000" }}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-white">{initials}</span>
              )}
            </motion.div>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white border border-black rounded-lg shadow-lg overflow-hidden z-50"
                  style={{ boxShadow: "4px 4px 0px #000000" }}
                >
                  <button
                    className="w-full px-4 py-2 text-left text-black hover:bg-[#FF2D2D] hover:text-white transition"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    👤 Profile
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-black hover:bg-[#FF2D2D] hover:text-white transition"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* 🔹 Page Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Greeting */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          👋 Welcome, <span style={{ color: "#FF2D2D" }}>{user?.username}</span>
        </motion.h2>

        {/* 🔹 Buttons Row */}
        <div className="flex justify-between items-center mb-8">
          {/* Create Meeting */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/create-meeting")}
            className="px-6 py-3 bg-[#FF2D2D] text-white font-semibold border border-black flex items-center gap-2"
            style={{ boxShadow: "6px 6px 0px #000000" }}
          >
            <span className="text-xl">＋</span> Create Meeting
          </motion.button>

          {/* AI Assistant (animated attract attention) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "6px 6px 0px #000000, 0px 0px 8px #22c55e",
                "6px 6px 0px #000000, 0px 0px 20px #22c55e",
                "6px 6px 0px #000000, 0px 0px 8px #22c55e",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() => navigate("/ai-assistant")}
            className="px-6 py-3 bg-green-500 text-white font-semibold border border-black"
            style={{ boxShadow: "6px 6px 0px #000000" }}
          >
            AI Assistant
          </motion.button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Meeting Cards */}
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Your Meetings
            </h3>
            {meetings.length === 0 ? (
              <div className="text-gray-600 italic">
                No meetings scheduled yet.
              </div>
            ) : (
              <div className="space-y-6">
                {meetings.map((m, index) => (
                  <motion.div
                    key={m.id}
                    ref={(el) => (cardRefs.current[m.id] = el)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white border border-black rounded-xl p-6 transition-all duration-300 ${
                      highlightedId === m.id ? "ring-4 ring-[#FF2D2D]" : ""
                    }`}
                    style={{ boxShadow: "4px 4px 0px #000000" }}
                  >
                    <h4
                      className="text-lg font-bold mb-2"
                      style={{ color: "#FF2D2D" }}
                    >
                      {index + 1}) {m.title}
                    </h4>
                    <p className="text-gray-700 mb-2">
                      {m.description || "No description"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {m.location || "No location"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      🕒 {m.startTime} → {m.endTime}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      👤 Organizer: {m.organizerUsername || "Unknown"}
                    </p>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-yellow-400 border border-black rounded text-black font-medium"
                        style={{ boxShadow: "2px 2px 0px #000000" }}
                        onClick={() => handleEdit(m)}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-[#FF2D2D] border border-black rounded text-white font-medium"
                        style={{ boxShadow: "2px 2px 0px #000000" }}
                        onClick={() => handleDelete(m.id)}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Calendar
            </h3>
            <div
              className="bg-white border border-black rounded-xl p-4"
              style={{ boxShadow: "6px 6px 0px #000000" }}
            >
              <style>
                {`
                  .rbc-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    font-family: Inter, sans-serif;
                  }
                  .rbc-toolbar button {
                    background: white;
                    border: 1px solid black;
                    padding: 6px 12px;
                    margin: 0 4px;
                    font-weight: 500;
                    border-radius: 6px;
                    box-shadow: 2px 2px 0px #000000;
                    transition: all 0.2s ease;
                  }
                  .rbc-toolbar button:hover {
                    background: #FF2D2D;
                    color: white;
                    transform: translate(-1px, -1px);
                    box-shadow: 3px 3px 0px #000000;
                  }
                  .rbc-toolbar-label {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: #FF2D2D;
                  }
                `}
              </style>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={["month", "day"]}
                style={{ height: 550 }}
                onSelectEvent={handleEventClick}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: "#FF2D2D",
                    color: "#fff",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                  },
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
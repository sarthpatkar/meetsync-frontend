// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateMeeting from "./pages/CreateMeeting";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import AIAssistantWrapper from "./pages/AIAssistantWrapper"; // ✅ Use wrapper (robot + toggle)

// ✅ Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      {/* All Routes */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-meeting"
          element={
            <PrivateRoute>
              <CreateMeeting />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ✅ AI Assistant route → loads wrapper first */}
        <Route
          path="/ai-assistant"
          element={
            <PrivateRoute>
              <AIAssistantWrapper />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Router>
  );
}

export default App;
// src/pages/Landing.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // For the new X logo
import { FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi"; // ADD THIS at top with imports

function Landing() {
  const [openIndex, setOpenIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // NEW
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Benefit items animation
    const benefitObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateX(0)";
            entry.target.style.transition =
              "opacity 0.8s ease-out, transform 0.8s ease-out";
          }, index * 200);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll(".benefit-item").forEach((item) => benefitObserver.observe(item));

    // FAQ fade-in
    const faqObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            entry.target.style.transition =
              "opacity 0.6s ease-out, transform 0.6s ease-out";
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".faq-item").forEach((item) => faqObserver.observe(item));
  }, []);

  return (
    <div className="bg-page text-black dark:bg-gray-900 dark:text-white">
      {/* ✅ Custom styles */}
      <style>{`
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .btn-primary {
          background-color: #FF2D2D;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 16px;
          padding: 12px 24px;
          border: none;
          border-radius: 0px;
          box-shadow: 4px 4px 0px #888888;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background-color: #E02525;
          box-shadow: 6px 6px 0px #888888;
          transform: translate(-1px, -1px);
        }
        .btn-arrow { font-weight: bold; }
        .feature-card {
          background: #fff;
          border: 1px solid #000;
          border-radius: 6px;
          box-shadow: 4px 4px 0px #000;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 6px 6px 0px #000; }
        .nav-link:hover, .nav-link.active { color: #FF2D2D; }
      `}</style>
  
  {/* ✅ HEADER with Glassmorphism */}
  <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 border-b border-gray-200">
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="#FF2D2D"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
          </svg>
          <span className="text-2xl font-bold text-heading">MeetSync</span>
        </div>

        {/* Nav Links - Desktop Only */}
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="nav-link font-medium">Features</a>
          <a href="#how-it-works" className="nav-link font-medium">How It Works</a>
          <a href="#benefits" className="nav-link font-medium">Benefits</a>
          <a href="#ai-assistant" className="nav-link font-medium"><b>AI Assistant</b></a>
          <a href="#faq" className="nav-link font-medium">FAQ</a>
        </nav>
         
         
        {/* Auth Buttons - Desktop Only */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="px-6 py-2 bg-white border border-black text-black font-medium 
            shadow-[4px_4px_0px_rgba(0,0,0,0.6)] 
            hover:translate-x-[-2px] hover:translate-y-[-2px] 
            hover:shadow-[6px_6px_0px_rgba(0,0,0,0.6)] 
            transition-all duration-200">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary">
            Create New Account <span className="btn-arrow">→</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded border border-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </div>

    {/* Mobile Dropdown Menu */}
    {menuOpen && (
      <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-6 py-4 space-y-4">
        <a href="#features" className="block nav-link">Features</a>
        <a href="#how-it-works" className="block nav-link">How It Works</a>
        <a href="#benefits" className="block nav-link">Benefits</a>
        <a href="#ai-assistant" className="block nav-link">AI Assistant</a>
        <a href="#faq" className="block nav-link">FAQ</a>
        <hr className="border-gray-200" />
        <Link to="/login" className="block nav-link">Sign In</Link>
        <Link to="/register" className="block nav-link text-[#FF2D2D] font-bold">Create Account</Link>
      </div>
    )}
  </header>


      {/* ✅ HERO, PROBLEM, FEATURES, HOW IT WORKS, BENEFITS (unchanged from your code) */}

      {/* ✅ HERO */}
      <section className="bg-page py-20 dark:bg-gray-900">

        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
         <h1 className="mb-6 leading-tight font-extrabold font-sans">
  <span className="block text-black text-5xl md:text-6xl lg:text-[5.5rem]">
    Schedule Meetings
  </span>
  <span
  className="block text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold"
  style={{ color: "#FF2D2D" }}
>
  Without the Hassle
</span>

</h1>
         <p className="text-xl text-body mb-12 max-w-3xl mx-auto leading-relaxed">
            MeetSync automatically detects conflicts, sends invitations, and keeps everyone in sync. 
            Free forever for teams that want to focus on productive meetings.
          </p>
          <div className="flex justify-center mb-16">
            <Link to="/register" className="btn-primary">
              Start Scheduling Free <span className="btn-arrow">→</span>
            </Link>
          </div>

          {/* Hero Stats */}
<div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
  <div className="text-center">
    <div
      className="text-4xl font-bold mb-2"
      style={{ color: "#FF2D2D" }}
    >
      100%
    </div>
    <p className="text-muted font-medium">Free</p>
  </div>
  <div className="text-center">
    <div
      className="text-4xl font-bold mb-2"
      style={{ color: "#FF2D2D" }}
    >
      0
    </div>
    <p className="text-muted font-medium">Setup Time</p>
  </div>
  <div className="text-center">
    <div
      className="text-4xl font-bold mb-2"
      style={{ color: "#FF2D2D" }}
    >
      ∞
    </div>
    <p className="text-muted font-medium">Meetings</p>
  </div>
</div>

        </div>
      </section>

      {/* ✅ PROBLEM STATEMENT */}
      <section className="section-divider py-20 bg-page">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              The Meeting Scheduling <span className="text-accent">Problem</span>
            </h2>
            <p className="text-xl text-body max-w-3xl mx-auto">
              These common scheduling challenges slow down teams and create unnecessary stress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">⏰</div>
              <h3 className="text-lg font-bold text-subheading mb-2">Double-Booking Disasters</h3>
              <p className="text-body text-sm">Overlapping meetings create chaos and damage professional relationships</p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">📧</div>
              <h3 className="text-lg font-bold text-subheading mb-2">Endless Email Chains</h3>
              <p className="text-body text-sm">"How about Tuesday?" "Can't do Tuesday, Wednesday?" Back and forth forever</p>
            </div>

            {/* Card 3 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">📅</div>
              <h3 className="text-lg font-bold text-subheading mb-2">Manual Calendar Checking</h3>
              <p className="text-body text-sm">Switching between apps and time zones to find available slots</p>
            </div>

            {/* Card 4 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">🔄</div>
              <h3 className="text-lg font-bold text-subheading mb-2">Last-Minute Changes</h3>
              <p className="text-body text-sm">Scrambling to notify everyone when meetings need to be rescheduled</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FEATURES */}
      <section id="features" className="section-divider py-20 bg-page">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Schedule <span className="text-accent">Smart</span>
            </h2>
            <p className="text-xl text-body max-w-2xl mx-auto">
              Powerful features that make meeting coordination effortless for teams of any size.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="feature-card p-6">
              <h3 className="text-xl font-bold mb-3">✅ Smart Conflict Detection</h3>
              <p className="text-base text-body">
                Never double-book again. MeetSync automatically detects scheduling conflicts across all your calendars and suggests alternative times.
              </p>
            </div>
            <div className="feature-card p-6">
              <h3 className="text-xl font-bold mb-3">✏️ Easy Meeting Editing</h3>
              <p className="text-base text-body">
                Plans change? No problem. Edit meeting details, reschedule, or update participants with just a few clicks.
              </p>
            </div>
            <div className="feature-card p-6">
              <h3 className="text-xl font-bold mb-3">📩 Automatic Email Invitations</h3>
              <p className="text-base text-body">
                Send professional meeting invitations with calendar attachments. Participants get all the details they need.
              </p>
            </div>
            <div className="feature-card p-6">
              <h3 className="text-xl font-bold mb-3">👥 Multi-Participant Scheduling</h3>
              <p className="text-base text-body">
                Find the perfect time for groups of any size. See everyone's availability at a glance and book when it works for all.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* ✅ HOW IT WORKS */}
<section id="how-it-works" className="section-divider py-20 bg-page">
  <div className="max-w-6xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        How MeetSync{" "}
        <span style={{ color: "#FF2D2D" }}>Works</span>
      </h2>
      <p
        className="text-xl text-body"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Get started in three simple steps – no complex setup or training required
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-12">
      {/* Step 1 */}
      <div className="text-center">
        <div
          className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
          style={{ backgroundColor: "#FF2D2D" }}
        >
          1
        </div>
        <h3
          className="text-2xl font-bold mb-4 text-black"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Create Your Meeting
        </h3>
        <p
          className="text-body mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Set up your meeting details including title, description, duration, and
          location.
        </p>
        <ul
          className="text-center text-muted space-y-2 max-w-xs mx-auto text-base"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <li>• Add title and description</li>
          <li>• Set duration and location</li>
          <li>• Invite participants by email</li>
        </ul>
      </div>

      {/* Step 2 */}
      <div className="text-center">
        <div
          className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
          style={{ backgroundColor: "#FF2D2D" }}
        >
          2
        </div>
        <h3
          className="text-2xl font-bold mb-4 text-black"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Smart Scheduling
        </h3>
        <p
          className="text-body mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          MeetSync automatically checks calendars for conflicts and suggests the
          best times.
        </p>
        <ul
          className="text-center text-muted space-y-2 max-w-xs mx-auto text-base"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <li>• Conflict detection</li>
          <li>• Smart time suggestions</li>
          <li>• Real-time availability</li>
        </ul>
      </div>

      {/* Step 3 */}
      <div className="text-center">
        <div
          className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
          style={{ backgroundColor: "#FF2D2D" }}
        >
          3
        </div>
        <h3
          className="text-2xl font-bold mb-4 text-black"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Send & Sync
        </h3>
        <p
          className="text-body mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Invitations are automatically sent to participants and synced to
          calendars.
        </p>
        <ul
          className="text-center text-muted space-y-2 max-w-xs mx-auto text-base"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <li>• Email invitations</li>
          <li>• Calendar sync</li>
          <li>• Instant notifications</li>
        </ul>
      </div>
    </div>
  </div>
</section>


{/* ✅ BENEFITS */}
<section id="benefits" className="section-divider py-20 bg-[#FFF9F9]">
  <div className="max-w-4xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
        Save Time and Reduce Stress
      </h2>
    </div>

    <div className="space-y-16">
      {/* Benefit 1 */}
      <div className="benefit-item flex items-center gap-12 opacity-0 transform translate-x-8">
        <div className="benefit-icon w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 bg-red-50">
          <svg className="w-10 h-10" fill="none" stroke="#FF2D2D" viewBox="0 0 24 24" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
            Reduce scheduling time by 75%
          </h3>
          <p className="text-lg leading-relaxed text-body" style={{ fontFamily: "Inter, sans-serif" }}>
            Eliminate the back-and-forth emails and manual calendar checking that wastes hours each week.
          </p>
        </div>
      </div>

      {/* Benefit 2 */}
      <div className="benefit-item flex items-center gap-12 opacity-0 transform translate-x-8">
        <div className="benefit-icon w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 bg-red-50">
          <svg className="w-10 h-10" fill="none" stroke="#FF2D2D" viewBox="0 0 24 24" strokeWidth="2">
            <path d="m9 12 2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
            Eliminate double-booking
          </h3>
          <p className="text-lg leading-relaxed text-body" style={{ fontFamily: "Inter, sans-serif" }}>
            Smart conflict detection ensures you never accidentally schedule overlapping meetings again.
          </p>
        </div>
      </div>

      {/* Benefit 3 */}
      <div className="benefit-item flex items-center gap-12 opacity-0 transform translate-x-8">
        <div className="benefit-icon w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 bg-red-50">
          <svg className="w-10 h-10" fill="none" stroke="#FF2D2D" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="m22 21-3-3" />
            <circle cx="17" cy="17" r="3" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
            Improve team productivity
          </h3>
          <p className="text-lg leading-relaxed text-body" style={{ fontFamily: "Inter, sans-serif" }}>
            When scheduling is effortless, teams spend more time on meaningful work and less on coordination.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    
     
     {/* ✅ AI ASSISTANT SECTION */}
<section id="ai-assistant" className="section-divider py-20 bg-white">
  <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
    <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
      Meet Your <span style={{ color: "#FF2D2D" }}>AI Assistant</span>
    </h2>
    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10" style={{ fontFamily: "Inter, sans-serif" }}>
      Ask questions, draft content, solve coding issues, or ask anything.
        <br></br>The AI Assistant in MeetSync makes your meetings smarter and faster.
    </p>
    <div className="flex justify-center">
      <Link to="/login" className="btn-primary">
        Try AI Assistant <span className="btn-arrow">→</span>
      </Link>
    </div>
  </div>
     </section>

      {/* ✅ FAQ */}
<section id="faq" className="section-divider py-20 bg-[#FFF9F9]">
  <div className="max-w-4xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2
        className="text-4xl font-bold mb-4"
        style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif", color: "#000000" }}
      >
        Frequently Asked <span style={{ color: "#FF2D2D" }}>Questions</span>
      </h2>
      <p
        className="text-xl"
        style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif", color: "#555555" }}
      >
        Everything you need to know about MeetSync
      </p>
    </div>

    <div className="space-y-6">
      {[
        {
          q: "How does conflict detection work?",
          a: "MeetSync connects to participants' calendars through secure API integrations and automatically checks for existing appointments during your proposed meeting times. It then suggests alternative times when all participants are available.",
        },
        {
          q: "Which calendar applications are supported?",
          a: "MeetSync integrates with Google Calendar, Microsoft Outlook, Apple Calendar, and most other calendar applications that support CalDAV and iCal.",
        },
        {
          q: "Is MeetSync really completely free?",
          a: "Yes, MeetSync is completely free with no hidden costs, subscription fees, or meeting limits. All core features including conflict detection, email invitations, and calendar integration are available at no charge.",
        },
        {
          q: "How secure is my calendar data?",
          a: "Your calendar data is protected with enterprise-grade encryption both in transit and at rest. MeetSync only accesses availability information needed for scheduling and never stores sensitive meeting content.",
        },
        {
          q: "Can I use MeetSync for recurring meetings?",
          a: "Yes, MeetSync supports both one-time and recurring meetings. You can set up weekly team meetings, monthly reviews, or any custom recurrence pattern, and the system will check for conflicts across all instances.",
        },
        {
          q: "What happens when someone can't attend a scheduled meeting?",
          a: "If a participant becomes unavailable, you can easily reschedule the meeting through MeetSync. The system will find new available times for all participants and automatically send updated invitations.",
        },
      ].map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="faq-item bg-white p-6 rounded border border-black cursor-pointer transition-all duration-300 hover:shadow-lg"
            style={{ boxShadow: "4px 4px 0px #000000" }}
            onClick={() => setOpenIndex(isOpen ? null : idx)}
          >
            {/* Question */}
            <div className="faq-question flex justify-between items-center">
              <h3
                className="text-lg font-bold pr-4"
                style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif", color: "#000000" }}
              >
                {item.q}
              </h3>
              <svg
                className={`faq-icon w-5 h-5 transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="#000000"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>

            {/* Answer */}
            <div
              className={`faq-answer mt-4 overflow-hidden transition-all duration-500 ${
                isOpen ? "max-h-screen" : "max-h-0"
              }`}
            >
              <p
                className="pb-2"
                style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif", color: "#555555" }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* ✅ FOOTER */}
<footer className="section-divider bg-page py-16">
  <div className="max-w-6xl mx-auto px-6 lg:px-8">
    <div className="grid md:grid-cols-1 gap-8 text-center">
      {/* Left Side */}
      <div>
        <div className="flex justify-center items-center space-x-3 mb-6">
          <span className="text-2xl font-bold text-heading">MeetSync</span>
        </div>
        <p
          className="text-body mb-6 max-w-md mx-auto"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          The free meeting scheduler that actually works. No more back-and-forth
          emails, no more double-booking disasters.
        </p>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="border-t border-gray-100 mt-12 pt-8 text-center">
      {/* Contact Links Row */}
      <div className="flex justify-center space-x-10 mt-6 text-body text-3xl">
        
        {/* Email */}
        <div className="relative group">
          <a
            href="mailto:sarthpatkar70@gmail.com"
            className="transition-transform transform group-hover:scale-110 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope />
          </a>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 
            opacity-0 group-hover:opacity-100 
            translate-y-2 group-hover:translate-y-0 
            bg-gray-800 text-white text-xs px-2 py-1 rounded 
            transition-all duration-300">
            Email
          </span>
        </div>

        {/* LinkedIn */}
        <div className="relative group">
          <a
            href="https://www.linkedin.com/in/sarth-patkar-a9bb1332b"
            className="transition-transform transform group-hover:scale-110 group-hover:text-blue-600 group-hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 
            opacity-0 group-hover:opacity-100 
            translate-y-2 group-hover:translate-y-0 
            bg-gray-800 text-white text-xs px-2 py-1 rounded 
            transition-all duration-300">
            LinkedIn
          </span>
        </div>

        {/* Instagram */}
        <div className="relative group">
          <a
            href="https://www.instagram.com/sarthpatkar"
            className="transition-transform transform group-hover:scale-110 group-hover:text-pink-500 group-hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 
            opacity-0 group-hover:opacity-100 
            translate-y-2 group-hover:translate-y-0 
            bg-gray-800 text-white text-xs px-2 py-1 rounded 
            transition-all duration-300">
            Instagram
          </span>
        </div>

        {/* X (Twitter) */}
        <div className="relative group">
          <a
            href="https://x.com/SarthPatkar08"
            className="transition-transform transform group-hover:scale-110 group-hover:text-black dark:group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 
            opacity-0 group-hover:opacity-100 
            translate-y-2 group-hover:translate-y-0 
            bg-gray-800 text-white text-xs px-2 py-1 rounded 
            transition-all duration-300">
            X (Twitter)
          </span>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6">
        <p className="text-muted">&copy; 2025 MeetSync. All rights reserved.</p>
      </div>
    </div>
  </div>
</footer>

</div>
  );
}

export default Landing;
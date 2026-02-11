// src/pages/AIAssistantWrapper.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AIChat from "./AIChat";
import Lottie from "lottie-react";
import robotAnimation from "../assets/ai.json"; // ✅ Lottie robot

function AIAssistantWrapper() {
  const [superMode, setSuperMode] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleToggle = () => {
    if (isOn) return; // prevent multiple clicks
    setIsOn(true);
    setCelebrating(true);

    setTimeout(() => {
      setCelebrating(false);
      setSuperMode(true);
    }, 2200); // Celebration before entering AIChat
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!superMode ? (
          <motion.div
            key="intro"
            className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* 🔥 Fullscreen animated gradient */}
            <motion.div
              className="absolute inset-0 animate-gradient pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg,#2a064b 0%, #07020a 45%, #08102a 100%)",
              }}
              aria-hidden="true"
            />

            {/* ⚡ Vertical scanning streaks */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(isMobile ? 4 : 12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[2px] h-[140%] top-[-20%] bg-gradient-to-b from-cyan-400/30 to-transparent"
                  style={{
                    left: `${5 + i * 8}%`,
                    opacity: 0.15,
                    filter: "blur(6px)",
                  }}
                  animate={{ y: ["-120%", "120%"] }}
                  transition={{
                    duration: 6 + (i % 4),
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* 💠 Rotating neon rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(isMobile ? 1 : 3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-cyan-400/20"
                  style={{
                    width: 500 + i * 140,
                    height: 500 + i * 140,
                    filter: "blur(2px)",
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 25 + i * 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* 🔷 Diagonal glowing sweeps */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(isMobile ? 3 : 8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[2px] w-[180%] bg-gradient-to-r from-fuchsia-400/40 via-cyan-400/30 to-transparent"
                  style={{
                    top: `${10 + i * 12}%`,
                    left: "-50%",
                    transform: "rotate(-25deg)",
                    filter: "blur(2px)",
                  }}
                  animate={{ x: ["-60%", "60%"] }}
                  transition={{
                    duration: 10 + i * 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* 🌐 Faint grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                mixBlendMode: "overlay",
                animation: "gridPulse 6s infinite ease-in-out",
              }}
              aria-hidden="true"
            />

            {/* ✨ Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(isMobile ? 6 : 20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    left: `${Math.random() * 100}%`,
                    top: `${80 + Math.random() * 20}%`,
                    opacity: 0,
                  }}
                  animate={{
                    top: `${-30 - Math.random() * 40}%`,
                    opacity: [0, 0.7, 0],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    width: 6 + Math.random() * 8,
                    height: 6 + Math.random() * 8,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(0,255,255,0.7), rgba(0,0,0,0))",
                    filter: "blur(3px)",
                  }}
                />
              ))}
            </div>

            {/* 🌌 Holographic scanning wave */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,255,255,0.15) 0%, transparent 60%)",
              }}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />

            {/* ⚡ Cyberpunk glowing circuit lines */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(isMobile ? 2 : 6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[2px] w-[130%] neon-line"
                  style={{
                    top: `${15 + i * 14}%`,
                    left: "-50%",
                  }}
                  animate={{ x: ["-50%", "100%"] }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.6,
                  }}
                />
              ))}
              {[...Array(isMobile ? 2 : 6)].map((_, i) => (
                <motion.div
                  key={`vert-${i}`}
                  className="absolute w-[2px] h-[130%] neon-line-vert"
                  style={{
                    top: "-20%",
                    left: `${15 + i * 14}%`,
                  }}
                  animate={{ x: ["-20%", "20%"] }}
                  transition={{
                    duration: 12 + i,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            {/* --------- Robot Area --------- */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.04 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="relative z-10 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                width: isMobile ? 260 : 420,
                height: isMobile ? 260 : 420,
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.6), inset 0 0 120px rgba(2,10,30,0.6)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(2,4,6,0.98) 0%, rgba(4,8,14,0.95) 45%, rgba(0,0,0,0) 100%)",
                }}
              />
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0.6, scale: 0.95 }}
                animate={{ opacity: 0.9, scale: 1.1 }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  inset: "-12%",
                  borderRadius: "50%",
                  filter: isMobile ? "blur(30px)" : "blur(70px)",
                  background:
                    "radial-gradient(circle, rgba(0,200,255,0.25), rgba(0,0,0,0))",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "86%",
                  height: "86%",
                }}
              >
                <Lottie
                  animationData={robotAnimation}
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                  }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold tracking-wider z-30"
              style={{
                textShadow: "0 0 20px rgba(0,255,255,0.6)",
                color: "#ffd6ff",
                marginTop: 18,
              }}
            >
              AI SUPER MODE
            </motion.h1>

            {/* Toggle with Celebration */}
            <motion.div whileHover={{ scale: 1.03 }} className="mt-7 z-30 relative">
              <label className="flex items-center cursor-pointer select-none">
                <span className="mr-4 text-lg">OFF</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isOn}
                    readOnly
                    className="sr-only"
                    onClick={handleToggle}
                  />
                  <motion.div
                    animate={
                      celebrating
                        ? { scale: [1, 1.3, 0.9, 1.1, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 1.2 }}
                    style={{
                      width: 112,
                      height: 56,
                      borderRadius: 9999,
                      background: isOn
                        ? "linear-gradient(90deg,#6d28d9,#9333ea,#f472b6)"
                        : "#1f1b2b",
                      padding: 6,
                      border: "3px solid rgba(120,50,200,0.55)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <motion.div
                      layout
                      animate={{ x: isOn ? 56 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 9999,
                        background: "linear-gradient(180deg,#c084fc,#8b5cf6)",
                      }}
                    />
                    {celebrating && (
                      <>
                        {[...Array(25)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            animate={{
                              opacity: 0,
                              scale: 0.6,
                              x: (Math.random() - 0.5) * 200,
                              y: (Math.random() - 0.5) * 200,
                              rotate: Math.random() * 360,
                            }}
                            transition={{
                              duration: 1.8,
                              ease: "easeOut",
                              delay: Math.random() * 0.2,
                            }}
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              width: 6 + Math.random() * 6,
                              height: 6 + Math.random() * 6,
                              borderRadius: "50%",
                              background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                            }}
                          />
                        ))}
                        <motion.div
                          initial={{ opacity: 0.6, scale: 0 }}
                          animate={{ opacity: 0, scale: 4 }}
                          transition={{ duration: 1.4, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 9999,
                            background:
                              "radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)",
                          }}
                        />
                      </>
                    )}
                  </motion.div>
                </div>
                <span className="ml-4 text-lg">ON</span>
              </label>
            </motion.div>

            <style>{`
              @keyframes gridPulse {
                0% { opacity: 0.04; transform: translateY(0); }
                50% { opacity: 0.13; transform: translateY(-4px); }
                100% { opacity: 0.04; transform: translateY(0); }
              }
              .animate-gradient {
                background-size: 240% 240%;
                animation: gradientMove 14s linear infinite;
              }
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .neon-line {
                background: linear-gradient(90deg, rgba(0,255,255,0) 0%, rgba(0,255,255,0.9) 40%, rgba(255,0,255,0.9) 60%, rgba(255,0,255,0) 100%);
                box-shadow: 0 0 15px rgba(0,255,255,0.7), 0 0 35px rgba(255,0,255,0.5);
                filter: blur(1.2px);
                animation: neonPulse 3s ease-in-out infinite;
              }
              .neon-line-vert {
                background: linear-gradient(180deg, rgba(255,0,255,0) 0%, rgba(255,0,255,0.9) 40%, rgba(0,255,255,0.9) 60%, rgba(0,255,255,0) 100%);
                box-shadow: 0 0 15px rgba(255,0,255,0.7), 0 0 35px rgba(0,255,255,0.5);
                filter: blur(1.2px);
                animation: neonPulse 3s ease-in-out infinite;
              }
              @keyframes neonPulse {
                0%, 100% { opacity: 0.6; filter: blur(1px); }
                50% { opacity: 1; filter: blur(2.2px); }
              }
            `}</style>
          </motion.div>
        ) : (
          <motion.div
            key="ai-chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 w-full h-full"
          >
            <AIChat />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIAssistantWrapper;
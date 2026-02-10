// src/pages/AIChat.js
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateImage } from "../api/axiosConfig"; 

function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false); // ✅ New state
  const [listening, setListening] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  let typingTimeouts = useRef([]);
  let recognitionRef = useRef(null);

  // Load messages
  useEffect(() => {
    const saved = localStorage.getItem("aiChatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("aiChatMessages", JSON.stringify(messages));
  }, [messages]);

  // ✅ Speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(finalTranscript.trim());
        }
      };
    } else {
      console.warn("Speech Recognition not supported");
    }
  }, []);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streaming]);

  // Scroll button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        80;
      setShowScrollBtn(!atBottom);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Textarea auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // Helpers
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    toast.success("Copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleClearChat = () => setConfirmClear(true);
  const confirmClearChat = () => {
    setMessages([]);
    localStorage.removeItem("aiChatMessages");
    toast.info("Chat cleared");
    setConfirmClear(false);
  };

  const stopGenerating = () => {
    typingTimeouts.current.forEach((t) => clearTimeout(t));
    typingTimeouts.current = [];
    setStreaming(false);
    setIsTyping(false);
  };

  // Send message
  const handleSend = async (forcedInput) => {
    const messageText = forcedInput || input;
    if (!messageText.trim()) return;

    const userMessage = {
      sender: "user",
      text: messageText,
      time: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setIsTyping(true);
      setStreaming(true);

      const res = await api.post("/ai/chat", { message: messageText });
      const aiResponse = res.data?.reply || "No response";

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "", time: new Date().toISOString() },
      ]);

      let currentText = "";
      const words = aiResponse.split(" ");

      words.forEach((word, i) => {
        const timeout = setTimeout(() => {
          if (i === 0) setIsTyping(false);
          currentText += (i === 0 ? "" : " ") + word;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              sender: "ai",
              text: currentText,
              time: updated[updated.length - 1].time,
            };
            return updated;
          });

          if (i === words.length - 1) setStreaming(false);
        }, i * 30);
        typingTimeouts.current.push(timeout);
      });
    } catch (error) {
      console.error("AI Chat error:", error.response?.data || error.message);
      toast.error("Failed to get AI response.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong.",
          time: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
      setStreaming(false);
    }
  };

  // Mic control
  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setInput("");
      recognitionRef.current.start();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 ${
        darkMode ? "bg-black text-white" : "bg-[#f9f9f9] text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-4">
        <h2 className="text-2xl font-semibold">AI Chat Assistant</h2>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode((p) => !p)}
            className="px-3 py-1 text-sm rounded-md border"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearChat}
            className="px-3 py-1 text-sm rounded-md border"
          >
            Clear
          </motion.button>
          {/* ✅ Exit button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmExit(true)}
            className="px-3 py-1 text-sm rounded-md border border-red-500 text-red-500"
          >
            Exit
          </motion.button>
        </div>
      </div>

      {/* Chat Box */}
      <div
        className={`w-full max-w-4xl rounded-xl flex flex-col flex-1 border shadow-lg relative ${
          darkMode ? "bg-neutral-950 border-neutral-800" : "bg-white border-gray-300"
        }`}
        style={{ height: "80vh" }}
      >
        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 relative"
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm max-w-[70%] leading-relaxed relative group break-words whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-black text-white"
                    : darkMode
                    ? "bg-neutral-900 border border-neutral-700 text-white/90"
                    : "bg-gray-100 border border-gray-300 text-black/90"
                }`}
              >
                {msg.sender === "ai" ? (
                  <div className="relative group">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, children, ...props }) {
                          const codeText = String(children).replace(/\n$/, "");
                          if (inline) {
                            return (
                              <code
                                className="bg-gray-800 text-white px-1 rounded"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          }
                          return (
                            <div className="relative group">
                              <pre className="bg-gray-900 text-white p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                <code {...props}>{children}</code>
                              </pre>
                              <button
                                onClick={() => handleCopy(codeText, index)}
                                className="absolute top-2 right-2 text-xs bg-black/60 hover:bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                              >
                                {copiedCode === index ? "Copied!" : "Copy code"}
                              </button>
                            </div>
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                    {/* ✅ Copy full AI response button */}
                    <button
                      onClick={() => handleCopy(msg.text, `ai-${index}`)}
                      className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-gray-600 transition"
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  <>
                    {msg.text}
                    <button
                      onClick={() => handleCopy(msg.text, index)}
                      className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-gray-600 transition"
                    >
                      Copy
                    </button>
                  </>
                )}
              </div>
              {msg.sender === "ai" && (
                <span className="mt-1 text-[11px] text-gray-500">
                  {formatTime(msg.time)}
                </span>
              )}
            </motion.div>
          ))}

          {/* Typing dots */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-1.5 pl-4"
              >
                <motion.span
                  className={`w-1.5 h-1.5 rounded-full ${
                    darkMode ? "bg-neutral-400" : "bg-gray-500"
                  }`}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                <motion.span
                  className={`w-1.5 h-1.5 rounded-full ${
                    darkMode ? "bg-neutral-400" : "bg-gray-500"
                  }`}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                />
                <motion.span
                  className={`w-1.5 h-1.5 rounded-full ${
                    darkMode ? "bg-neutral-400" : "bg-gray-500"
                  }`}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              onClick={scrollToBottom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 
                         w-10 h-10 flex items-center justify-center 
                         rounded-full bg-white shadow-md border border-gray-200
                         hover:shadow-lg transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input + Mic + Send */}
        <div
          className={`p-4 flex gap-3 items-end border-t ${
            darkMode
              ? "border-neutral-800 bg-black/70"
              : "border-gray-300 bg-white/90"
          }`}
        >
          <div
            className={`flex items-center flex-1 rounded-2xl px-4 py-2 ${
              darkMode
                ? "bg-neutral-900 border border-neutral-700"
                : "bg-gray-100 border border-gray-300"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 resize-none text-sm focus:outline-none bg-transparent ${
                darkMode
                  ? "text-white placeholder-neutral-500"
                  : "text-black placeholder-gray-500"
              }`}
              rows={1}
              style={{ maxHeight: "120px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  !isTyping && handleSend();
                }
              }}
              disabled={streaming}
            />
          </div>

          {/* Mic */}
          <div className="flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMicToggle}
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                listening ? "bg-green-600" : "bg-black"
              } text-white shadow`}
            >
              {listening ? <MicOff size={22} /> : <Mic size={22} />}
            </motion.button>
            <AnimatePresence>
              {listening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center mt-2 text-xs text-green-500"
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500 mb-1"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                  Listening...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stop / Send */}
          {streaming ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopGenerating}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white shadow"
            >
              <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF2D2D] hover:bg-red-600 text-white shadow"
            >
              ➤
            </motion.button>
          )}
        </div>
      </div>

      {/* Confirm Clear Modal */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`p-6 rounded-xl shadow-xl ${
                darkMode ? "bg-neutral-900" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                Clear chat history?
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearChat}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Confirm Exit Modal */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`p-6 rounded-xl shadow-xl ${
                darkMode ? "bg-neutral-900" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                Exit to Dashboard?
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmExit(false)}
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmExit(false);
                    window.location.href = "/dashboard"; // ✅ Redirect
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIChat;
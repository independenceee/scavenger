"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, HelpCircle, Copy, Zap } from "lucide-react";
import { motion } from "framer-motion";

const formatTime = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { d, h, m, s };
};

const format = (n: number) => n.toString().padStart(2, "0");

export default function ScavengerMineChallenge() {
  const [countdown, setCountdown] = useState(
    5 * 86400 + 22 * 3600 + 5 * 60 + 16
  );
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { d, h, m, s } = formatTime(countdown);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: 1, title: "Choose a Destination address", status: "completed" },
    { id: 2, title: "Accept Token End User Terms", status: "completed" },
    { id: 3, title: "Solve cryptographic challenges", status: "active" },
    { id: 4, title: "View your submitted solutions", status: "pending" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="grid grid-cols-1 lg:grid-cols-[342px_1fr] gap-6 w-full max-w-[894px] h-[638px] overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
          <header className="border-b border-gray-200 dark:border-gray-700 px-6 h-[71px] flex items-center justify-between">
            <img
              src="/_next/static/media/GlacierDrop-text-logo.c5df7c3c.svg"
              alt="GlacierDrop"
              className="h-5"
            />
            <span className="rounded-full px-4 py-2 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Scavenger Mine
            </span>
          </header>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Countdown */}
            <div className="rounded-lg border p-4 bg-indigo-50/40 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-2 h-11">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Scavenger Mine ends in:
                </div>
                <div className="flex gap-1">
                  {[
                    { value: d, label: "D" },
                    { value: h, label: "H" },
                    { value: m, label: "M" },
                    { value: s, label: "S" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <motion.span
                        key={item.value}
                        animate={{ scale: item.value > 0 ? [1, 1.15, 1] : 1 }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 60,
                        }}
                        className="h-7 w-7 flex items-center justify-center font-mono text-xs rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold"
                      >
                        {format(item.value)}
                      </motion.span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <nav aria-label="Progress" className="space-y-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div
                    className={`flex items-center w-full gap-3 status-${step.status}`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                        step.status === "completed"
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : step.status === "active"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          step.status === "active"
                            ? "font-semibold text-gray-900 dark:text-white"
                            : step.status === "completed"
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    <HelpCircle className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute left-4.5 top-9 w-0.5 h-8 bg-gray-300 dark:bg-gray-700" />
                  )}
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <button className="w-full py-3 rounded font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Disconnect
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
          <header className="border-b border-gray-200 dark:border-gray-700 px-6 h-[71px] flex items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Solve cryptographic challenges
            </h2>
          </header>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Snapshot Card */}
            <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Snapshot
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      Updated every 24 hours
                    </span>
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Your estimated claim:
                    </span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      344.7761 NIGHT
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Your estimated share:
                    </span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      0.00005464%
                    </span>
                  </div>
                </div>

                {/* Destination Address Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Destination Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="addr1q..."
                      className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {address && (
                      <button
                        onClick={copyAddress}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 transition"
                      >
                        <Copy
                          className={`w-4 h-4 ${
                            copied ? "text-emerald-500" : ""
                          }`}
                        />
                        {copied && (
                          <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                What happens next?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Shortly after the Scavenger Mine ends, the Redemption period
                will start, and you'll be able to redeem your claimed allocation
                as it thaws via the NIGHT Claim Portal.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <button
              disabled={!address}
              className={`w-full py-3.5 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                address
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Zap className="w-4 h-4" />
              Donate
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

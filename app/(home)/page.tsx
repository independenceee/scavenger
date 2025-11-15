"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  HelpCircle,
  Copy,
  Wallet,
  Zap,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import wallets from "@/constants/wallets";
import { WalletType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/public/images";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { isNil } from "lodash";

const formatTime = (seconds: number) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { d, h, m, s };
};

const format = (n: number) => n.toString().padStart(2, "0");

export default function Home() {
  const { address, browserWallet, connect, disconnect } = useWallet();

  // common handlers

  const [countdown, setCountdown] = useState(
    5 * 86400 + 22 * 3600 + 9 * 60 + 39
  );
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [donateAddress, setDonateAddress] = useState("");
  const [downloaded, setDownloaded] = useState<WalletType[]>([]);
  const [notDownloaded, setNotDownloaded] = useState<WalletType[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { d, h, m, s } = formatTime(countdown);

  const steps = [
    { id: 1, title: "Connect Wallet", done: false },
    {
      id: 2,
      title: "Input Destination Address You Want To Donate",
      done: false,
    },
    {
      id: 3,
      title: "Sign The Message To Authorize Donation",
      done: false,
    },

    {
      id: 4,
      title: "Donate Night To Destination Address Successfully",
      done: false,
    },

    {
      id: 5,
      title: "Disconnect Wallet ",
      done: false,
    },
  ];

  // connect wallet handlers

  useEffect(() => {
    async function loadWallets() {
      setLoading(true);
      const downloadedWallets: WalletType[] = [];
      const notDownloadedWallets: WalletType[] = [];

      for (const wallet of wallets) {
        if (wallet.isDownload) {
          const isInstalled = await wallet.isDownload();
          if (isInstalled) {
            downloadedWallets.push(wallet);
          } else {
            notDownloadedWallets.push(wallet);
          }
        } else {
          notDownloadedWallets.push(wallet);
        }
      }

      setDownloaded(downloadedWallets);
      setNotDownloaded(notDownloadedWallets);
      setLoading(false);
    }
    loadWallets();
  }, []);

  const refreshWallets = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const connectWallet = async function () {
    if (!selectedWallet) return;

    if (selectedWallet?.enable && selectedWallet.isEnable) {
      await selectedWallet.enable();
    }

    await connect(selectedWallet as unknown as any);
  };

  // donation address handlers

  const copyAddress = () => {
    navigator.clipboard.writeText(donateAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const {
    data: night,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["night", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      const res = await axios.get(`/api/statistics?address=${address}`);
      return res.data;
    },
    enabled: !!address,
  });

  useEffect(() => {
    if (error) {
      toast.error(`Wallet address ${address} is not registered`);
    }
  }, [error, address]);

  const handleDonate = async () => {
    if (browserWallet && donateAddress && address) {
      try {
        const message = `Assign accumulated Scavenger rights to: ${donateAddress}`;
        const messageHex = Buffer.from(message, "utf8").toString("hex");

        const signature = await browserWallet.signData(messageHex);

        const res = await fetch("/api/donate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            donateAddress,
            userAddress: address,
            signature: signature.signature,
          }),
        });

        const result = await res.json();

        console.log(result);

        if (
          result?.details?.statusCode === 400 ||
          result?.details?.statusCode === 404 ||
          result?.details?.statusCode === 409
        ) {
          toast.error(result?.details?.message || "Donation request failed.");
          return;
        }

        toast.success(
          "Consolidation request submitted. Check transactions/receipts for details."
        );
      } catch (error: any) {
        console.error("Lỗi:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="grid grid-cols-1 lg:grid-cols-[342px_1fr] gap-6 w-full max-w-[894px] h-[638px] overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
          <header className="border-b border-gray-200 dark:border-gray-700 px-6 h-[71px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={images.logo}
                alt="GlacierDrop"
                className="h-10 w-10"
              />
              <div className="leading-tight min-w-0 flex-shrink">
                <div className="text-lg font-semibold text-[#003C8C] dark:text-[#00A3FF] break-words">
                  CARDANO2VN.IO
                </div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 break-words">
                  BREAK THE BLOCKS
                </div>
              </div>
            </div>
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
                        initial={{ scale: 1 }}
                        animate={{ scale: item.value > 0 ? [1, 1.2, 1] : 1 }}
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
                    className={`flex items-center w-full gap-3 ${
                      step.done ? "status-active" : "status-pending"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-all ${
                        step.done
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          step.done
                            ? "text-gray-900 dark:text-white"
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

          {browserWallet && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <button
                type="button"
                onClick={disconnect}
                className={`
        w-full flex items-center justify-center gap-2
        py-3 px-4 rounded-lg font-medium text-sm
        bg-red-50 dark:bg-red-900/20
        text-red-600 dark:text-red-400
        border border-red-200 dark:border-red-800
        hover:bg-red-100 dark:hover:bg-red-900/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
        transition-all duration-200
        shadow-sm
      `}
                aria-label="Disconnect wallet"
              >
                <Wallet className="w-4 h-4" />
                Disconnect Wallet
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        {!browserWallet ? (
          <main className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
            <header className="border-b border-gray-200 dark:border-gray-700 px-6 h-[71px] flex items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connect Wallet
              </h2>
            </header>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect a Cardano wallet to view your NIGHT allocation and
                consolidate accumulated NIGHT into a single destination wallet.
                After connecting, choose the destination wallet and authorize
                the consolidation action.
              </p>

              {/* Installed Wallets */}
              <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 mb-2">
                <span>Supported wallets installed on this browser:</span>
                <button
                  onClick={refreshWallets}
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {isRefreshing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Refresh this list</span>
                </button>
              </div>

              <div className="space-y-2">
                {downloaded.map((wallet) => (
                  <motion.button
                    key={wallet.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setSelectedWallet(wallet);
                    }}
                    className={`flex items-center w-full gap-3 p-4 rounded-lg border text-left text-xs transition-all ${
                      selectedWallet?.name === wallet.name
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedWallet?.name === wallet.name}
                      readOnly
                      className="w-5 h-5 text-indigo-600"
                    />
                    <Image
                      src={wallet.image}
                      alt={`${wallet} Logo`}
                      className="w-6 h-6"
                    />
                    <div className="flex-1">{wallet.name}</div>
                    <span className="px-2 py-1 text-[9px] font-bold uppercase rounded-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      INSTALLED
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Other Wallets */}
              <div className="text-xs text-gray-700 dark:text-gray-300">
                Other supported wallets:
              </div>
              <div className="space-y-2">
                {notDownloaded.map((wallet) => (
                  <button
                    key={wallet.name}
                    disabled
                    className="flex items-center w-full gap-3 p-4 rounded-lg border border-gray-300 dark:border-gray-600 text-left text-xs text-gray-400 cursor-not-allowed"
                  >
                    <Image
                      src={wallet.image}
                      alt={`${wallet.name} Logo`}
                      className="w-6 h-6"
                    />
                    <div className="flex-1">{wallet.name}</div>
                    <Link
                      href={wallet.downloadApi as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 underline"
                    >
                      Go to website
                    </Link>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <motion.button
                whileHover={selectedWallet ? { scale: 1.02 } : {}}
                whileTap={selectedWallet ? { scale: 0.98 } : {}}
                disabled={!selectedWallet}
                onClick={connectWallet}
                className={`w-full py-3.5 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  selectedWallet
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                Connect Wallet
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </main>
        ) : (
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
                        Estimated NIGHT to consolidate:
                      </span>
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {isLoading ? (
                          <span className="animate-pulse">Loading...</span>
                        ) : night?.local?.night_allocation ? (
                          `${(
                            Number(night.local.night_allocation) / 1_000_000
                          ).toFixed(4)} NIGHT`
                        ) : (
                          "0.0000 NIGHT"
                        )}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Estimated share of the pool:
                      </span>
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : night?.estimatedShare ? (
                          `${night.estimatedShare}%`
                        ) : (
                          "0.0000%"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Destination Address Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Destination Wallet (consolidation target)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={donateAddress}
                        onChange={(e) => setDonateAddress(e.target.value)}
                        placeholder="addr1q... (destination wallet address)"
                        className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                      {donateAddress && (
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
                  Contact Us?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  After the Scavenger Mine ends the system will begin
                  consolidation: registered wallets' NIGHT allocations will be
                  aggregated and batch-transferred to the destination wallet you
                  provide. Consolidation uses signed authorizations and batched
                  on-chain settlement to minimize fees; you will receive
                  receipts for each consolidated transfer.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <button
                onClick={handleDonate}
                disabled={!isNil(error) || !donateAddress}
                className={`w-full py-3.5 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  donateAddress
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                } ${
                  error &&
                  "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Donate Night
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

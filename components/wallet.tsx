import { WalletType } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function Wallet({
  wallet,
  selectedWallet,
  setSelectedWallet,
}: {
  wallet: WalletType;
  selectedWallet: string | null;
  setSelectedWallet: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <motion.button
      key={wallet.id}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => {
        setSelectedWallet(wallet.name);
      }}
      className={`flex items-center w-full gap-3 p-4 rounded-lg border text-left text-xs transition-all ${
        selectedWallet === wallet.name
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      <input
        type="radio"
        checked={selectedWallet === wallet.name}
        readOnly
        className="w-5 h-5 text-indigo-600"
      />
      <Image
        src={wallet.image as string}
        alt={`${wallet} Logo`}
        className="w-6 h-6"
      />
      <div className="flex-1">{wallet.name}</div>
      <span className="px-2 py-1 text-[9px] font-bold uppercase rounded-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
        INSTALLED
      </span>
    </motion.button>
  );
}

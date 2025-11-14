import { create } from "zustand";
import { BrowserWallet, UTxO, Wallet } from "@meshsdk/core";
import { toast } from "react-toastify";

export interface WalletStoreType {
  wallet: Wallet | null;
  address: string | null;
  browserWallet: BrowserWallet | null;

  disconnect: () => Promise<void>;
  connect: (wallet: Wallet) => Promise<void>;
}

export const useWallet = create<WalletStoreType>((set, get) => ({
  wallet: null,
  browserWallet: null,
  address: null,

  connect: async (wallet: Wallet) => {
    try {
      const { name } = wallet;
      const browserWallet: BrowserWallet = await BrowserWallet.enable(
        name.toLowerCase()
      );
      if (!browserWallet) {
        toast("Failed to connect wallet");
        return;
      }

      const network = await browserWallet.getNetworkId();
      if (network !== 1) {
        toast.error(`Invalid network, please switch to mainnet network`);
        return;
      }
      const address = await browserWallet.getChangeAddress();

      set({
        browserWallet: browserWallet,
        wallet: wallet,
        address: address,
      });
      toast.success("Connect Wallet Successfully !");
    } catch (error) {}
  },

  disconnect: async () => {
    set({ browserWallet: null!, wallet: null! });
    toast.success("Disconnect Wallet Successfully !");
  },
}));

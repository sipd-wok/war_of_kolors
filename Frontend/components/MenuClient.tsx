"use client";

import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";

export default function MenuClient() {
  const { walletAddress, balance } = useWallet();
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Game Menu</h1>
      {walletAddress ? (
        <div>
          <p className="mb-2">
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
          <p className="mb-4">Balance: {balance} tokens</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              router.push("/mainGame");
            }}
          >
            Start Game
          </button>
        </div>
      ) : (
        <p>Please connect your wallet to continue</p>
      )}
    </div>
  );
}

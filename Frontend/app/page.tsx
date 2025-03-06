"use client"; // ✅ Required for client components

// import { useState } from "react";
// import ConnectWallet from "@/components/WalletButton";
// import CheckBalance from "@/components/CheckBalance"; // Ensure this is a valid component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetaMaskSignIn } from "@/components/auth/MetaMaskSignIn";
import { GuestSignIn } from "@/components/auth/GuestSignIn";
export default function Home() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    if (walletConnected) {
      router.push("/signIn");
    }
  }, [walletConnected]);
  return (
    <div className="w-full max-w-sm mx-auto space-y-6 h-screen grid place-content-center">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      <MetaMaskSignIn setWalletConnected={setWalletConnected} />
      <GuestSignIn />
    </div>
  );
}

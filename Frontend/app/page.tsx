"use client"; // ✅ Required for client components

// import { useState } from "react";
// import ConnectWallet from "@/components/WalletButton";
// import CheckBalance from "@/components/CheckBalance"; // Ensure this is a valid component
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // const [walletConnect, setWalletConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.push("/signIn");
  });

  return (
    <main className="w-screen h-screen flex flex-wrap">
      {/* <ConnectWallet setWalletConnected={setWalletConnected} />
      {walletConnect && <CheckBalance />} */}
    </main>
  );
}

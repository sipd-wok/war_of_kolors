"use client";

import { Button } from "@/components/ui/button";
import { MetaMaskSVG } from "@/components/ui/metaMaskSVG";
import { metaMaskSignInAction } from "@/lib/auth/metaMaskSignInAction";
import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";

interface MetaMaskSignInProps {
  setWalletConnected: (connected: boolean) => void;
}

const MetaMaskSignIn: React.FC<MetaMaskSignInProps> = ({
  setWalletConnected,
}) => {
  const router = useRouter();
  const { walletAddress, setWalletAddress, fetchBalance, balance } =
    useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
      console.log("Wallet address is set:", walletAddress, balance);
    }
  }, [walletAddress, fetchBalance, balance]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setError(
          "MetaMask not installed. Please install MetaMask to continue.",
        );
        return;
      }
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error(
          "No accounts found. Please unlock your MetaMask wallet.",
        );
      }
      const address = accounts[0];
      console.log("Connected address:", address);
      setWalletAddress(address);

      // Set wallet connected immediately for better UX
      setWalletConnected(true);

      // Complete authentication before redirecting
      try {
        console.log("Starting authentication with address:", address);
        const result = await metaMaskSignInAction(address);
        console.log("Authentication result:", result);

        if (!result.success) {
          console.error("Authentication failed:", result.message);
          setError(
            `Authentication failed: ${result.message || "Unknown error"}`,
          );
          // Don't reset walletConnected here to avoid UI flickering
        }
      } catch (error) {
        // Log detailed error info
        console.error("Authentication error details:", error);
        setError(`Auth error: ${(error as Error).message || "Unknown error"}`);
        // Continue with wallet connected for better UX
      }

      router.push("/welcome");
    } catch (error) {
      // Log detailed error info
      console.error("Authentication error details:", error);
      setError(`Auth error: ${(error as Error).message || "Unknown error"}`);
      // Continue with wallet connected for better UX
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        variant="default"
        disabled={isConnecting}
        onClick={() => {
          connectWallet();
        }}
      >
        <MetaMaskSVG height={32} width={32} />
        {isConnecting ? "Connecting..." : "Connect with MetaMask"}
      </Button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export { MetaMaskSignIn };

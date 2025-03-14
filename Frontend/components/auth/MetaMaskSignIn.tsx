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
      // router.push("/welcome");
      // Perform actions that require walletAddress here
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

      try {
        // Complete the server action first and wait for it to finish
        await metaMaskSignInAction(address);

        // Only set walletConnected after successful authentication
        console.log("Authentication successful, setting wallet connected");
        setWalletConnected(true);

        // Direct navigation here can help ensure redirect happens
        router.push("/welcome");
      } catch (authError: unknown) {
        const errorMessage =
          authError instanceof Error ? authError.message : String(authError);

        // Check if this is NextAuth's redirect "error" (which is not really an error)
        if (errorMessage === "NEXT_REDIRECT") {
          console.log("NextAuth redirect detected - authentication successful");
          setWalletConnected(true);
          // The redirect will happen automatically through NextAuth
          return;
        }

        console.error("Authentication error details:", errorMessage);
        setError(`Authentication failed: ${errorMessage || "Unknown error"}`);
        return; // Exit early on actual auth error
      }
    } catch (error) {
      // Log detailed error info
      console.error("Error connecting to wallet:", error);
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

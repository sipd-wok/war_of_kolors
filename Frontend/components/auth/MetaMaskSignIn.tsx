"use client";

import { Button } from "@/components/ui/button";
import { MetaMaskSVG } from "@/components/ui/metaMaskSVG";
import { metaMaskSignInAction } from "@/lib/auth/metaMaskSignInAction";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MetaMaskSignInProps {
  setWalletConnected: (connected: boolean) => void;
}

const MetaMaskSignIn: React.FC<MetaMaskSignInProps> = ({
  setWalletConnected,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const checkIfWalletIsConnected = async () => {
  //     if (typeof window !== "undefined" && window.ethereum) {
  //       try {
  //         const accounts = await window.ethereum.request({
  //           method: "eth_accounts",
  //         });

  //         if (accounts && accounts.length > 0) {
  //           await connectWallet();
  //         }
  //       } catch (error) {
  //         console.error("Error checking wallet connection:", error);
  //       }
  //     }
  //   };

  //   checkIfWalletIsConnected();
  // }, []);

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
      setWalletConnected(true);
      // Now call the server action with the wallet address
      await metaMaskSignInAction(address).then(() => {
        router.push("/welcome");
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
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

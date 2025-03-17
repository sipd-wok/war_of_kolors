"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "@/utils/ethersProvider";
import { getTokenContract } from "@/utils/tokencontract";
import {
  sendTokens as SendTokens,
  shopPayment as ShopPayment,
  buyAndMintCharacter as BuyandMint,
} from "@/app/transactions/tokenTransactions";
import {
  mintNFT as MintNFT,
  transferNFT as TransferNFT,
} from "@/app/transactions/nftTransactions";
interface WalletContextType {
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
  walletAddress: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  sendTokens: (recipient: string, amount: string) => Promise<void>;
  shopPayment: (amount: string) => Promise<void>;
  mintNFT: (
    walletAddress: string,
    metadataURI: string,
  ) => Promise<{ success: boolean; tokenId: string | null }>;
  buyAndmint: (
    amount: string,
    walletAddress: string,
    metadataURI: string
  ) => Promise<{ message: string; tokenId: string | null }>;
  
  transferNFT: (from: string, to: string, tokenId: string) => Promise<void>;
  fetchBalance: (address: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");

  // const checkWalletConnection = useCallback(
  //   async () => {
  //     try {
  //       const provider = getProvider();
  //       const accounts = await provider.send("eth_accounts", []);
  //       if (accounts.length) {
  //         setWalletAddress(accounts[0]);
  //         fetchBalance(accounts[0]);
  //       }
  //     } catch (error) {
  //       console.error("Error checking wallet connection:", error);
  //     }
  //   },
  //   [
  //     /* fetchBalance will be added below */
  //   ],
  // );

  const fetchBalance = useCallback(async (address: string) => {
    try {
      const signer = await getSigner();
      const contract = getTokenContract(signer);
      const balanceRaw = await contract.balanceOf(address);
      setBalance(ethers.formatUnits(balanceRaw, 18));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  }, []);

  // Update checkWalletConnection dependencies
  const checkWalletConnectionWithDeps = useCallback(async () => {
    try {
      const provider = getProvider();
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length) {
        setWalletAddress(accounts[0]);
        fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  }, [fetchBalance]);

  useEffect(() => {
    checkWalletConnectionWithDeps();
  }, [checkWalletConnectionWithDeps]);

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      fetchBalance(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // TOKENS
  const sendTokens = useCallback(
    (recipient: string, amount: string) =>
      SendTokens(recipient, amount, walletAddress!, fetchBalance),
    [walletAddress, fetchBalance],
  );

  const shopPayment = useCallback(
    (amount: string) => ShopPayment(amount, walletAddress!, fetchBalance),
    [walletAddress, fetchBalance],
  );

  // NFTS
  // Make sure mintNFTWrapper returns the correct type
  const mintNFTWrapper = useCallback(
    async (
      walletAddress: string,
      metadataURI: string,
    ): Promise<{ success: boolean; tokenId: string | null }> => {
      return MintNFT(walletAddress, metadataURI);
    },
    [],
  );

  const transferNFT = useCallback(
    async (from: string, to: string, tokenId: string): Promise<void> => {
      await TransferNFT(from, to, tokenId);
      // Return void explicitly by not returning the boolean result
    },
    [],
  );

  const buyAndmint = useCallback(
    (amount: string, walletAddress: string, metadataURI: string): Promise<{ message: string; tokenId: string | null }> =>
      BuyandMint(amount, walletAddress, metadataURI, fetchBalance),
    [fetchBalance],
  );
  

  return (
    <WalletContext.Provider
      value={{
        setWalletAddress,
        walletAddress,
        balance,
        connectWallet,
        sendTokens,
        shopPayment,
        mintNFT: mintNFTWrapper,
        transferNFT,
        buyAndmint,
        fetchBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

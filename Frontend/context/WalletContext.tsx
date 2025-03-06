"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "@/utils/ethersProvider";
import { getContract } from "@/utils/contract";
interface WalletContextType {
  walletAddress: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  sendTokens: (recipient: string, amount: string) => Promise<void>;
  buyCharacter: (amount: string) =>Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
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
  };

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

  const fetchBalance = async (address: string) => {
    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const balanceRaw = await contract.balanceOf(address);
      setBalance(ethers.formatUnits(balanceRaw, 18));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const sendTokens = async (recipient: string, amount: string) => {
    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.transfer(
        recipient,
        ethers.parseUnits(amount, 18),
      );
      await tx.wait();
      alert("Transaction Successful!");
      fetchBalance(walletAddress!);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction Failed!");
    }
  };
  const buyCharacter = async (amount: string) => {
    try {
      if (!walletAddress) throw new Error("Wallet not connected");
      const devWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      if (!devWallet) throw new Error("Developer wallet address is not set");
  
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.transfer(devWallet, ethers.parseUnits(amount, 18));
      await tx.wait();
  
      alert("Character purchased successfully!");
      fetchBalance(walletAddress); 
    } catch (error) {
      console.error("Character purchase failed:", error);
      alert("Character purchase failed!");
    }
  };
  
  
  
  return (
    <WalletContext.Provider
      value={{ walletAddress, balance, connectWallet, sendTokens, buyCharacter }}
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

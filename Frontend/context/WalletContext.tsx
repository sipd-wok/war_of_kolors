"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { getProvider, getSigner } from "@/utils/ethersProvider";
import { getTokenContract } from "@/utils/tokencontract";
import { sendTokens as SendTokens, buyCharacter as BuyCharacter } from "@/app/transactions/tokenTransactions";
import { mintNFT as MintNFT, transferNFT as TransferNFT } from "@/app/transactions/nftTransactions";
interface WalletContextType {
  walletAddress: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  sendTokens: (recipient: string, amount: string) => Promise<void>;
  buyCharacter: (amount: string) =>Promise<void>
  mintNFT: (walletAddress: string,metadataURI: string) => Promise<void>;
  transferNFT: (to: string, tokenId: string) => Promise<void>;
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
      const contract = getTokenContract(signer);
      const balanceRaw = await contract.balanceOf(address);
      setBalance(ethers.formatUnits(balanceRaw, 18));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  // TOKENS
  const sendTokens = (recipient: string, amount: string) => SendTokens(recipient, amount, walletAddress!, fetchBalance);
  const buyCharacter = (amount: string) => BuyCharacter(amount, walletAddress!, fetchBalance);
  // NFTS
  const mintNFT= (walletAddress: string,metadataURI: string) => MintNFT(walletAddress!, metadataURI);
  const transferNFT = (to: string, tokenId: string) => TransferNFT(walletAddress!, to, tokenId);
  return (
    <WalletContext.Provider
      value={{ walletAddress, balance, 
        connectWallet, sendTokens, buyCharacter, 
        mintNFT, transferNFT }}
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

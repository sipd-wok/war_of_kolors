import { ethers } from "ethers";
import { getProvider, getSigner } from "@/utils/ethersProvider";
import { getTokenContract } from "@/utils/tokencontract";

export const checkWalletConnection = async (setWalletAddress: (address: string) => void, fetchBalance: (address: string) => void) => {
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

export const connectWallet = async (setWalletAddress: (address: string) => void, fetchBalance: (address: string) => void) => {
  try {
    const provider = getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletAddress(accounts[0]);
    fetchBalance(accounts[0]);
  } catch (error) {
    console.error("Wallet connection failed:", error);
  }
};

export const fetchBalance = async (address: string, setBalance: (balance: string) => void) => {
  try {
    const signer = await getSigner();
    const contract = getTokenContract(signer);
    const balanceRaw = await contract.balanceOf(address);
    setBalance(ethers.formatUnits(balanceRaw, 18));
  } catch (error) {
    console.error("Failed to fetch balance:", error);
  }
};


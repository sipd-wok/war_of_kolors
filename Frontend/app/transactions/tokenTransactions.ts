import { ethers } from "ethers";
import { getSigner } from "@/utils/ethersProvider";
import { getTokenContract } from "@/utils/tokencontract";
import { mintNFT } from "./nftTransactions";
export const sendTokens = async (recipient: string, amount: string, walletAddress: string, fetchBalance: (address: string) => void) => {
  try {
    const signer = await getSigner();
    const contract = getTokenContract(signer);
    const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18));
    await tx.wait();
    
    alert("Transaction Successful!");
    fetchBalance(walletAddress);
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction Failed!");
  }
};

export const shopPayment = async (amount: string, walletAddress: string, fetchBalance: (address: string) => void) => {
  console.log(amount,walletAddress,fetchBalance(walletAddress))
  try {
    if (!walletAddress) throw new Error("Wallet not connected");
    const devWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    if (!devWallet) throw new Error("Developer wallet address is not set");

    const signer = await getSigner();
    const contract = getTokenContract(signer);
    const tx = await contract.transfer(devWallet, ethers.parseUnits(amount, 18));
    await tx.wait();
    alert("Character purchased successfully!");
  } catch (error) {
    console.error("Character purchase failed:", error);
    alert("Character purchase failed!");
  }
};

export const buyAndMintCharacter = async (
  amount: string,
  walletAddress: string,
  metadataURI: string,
  fetchBalance: (address: string) => void
) => {
  try {
    if (!walletAddress) throw new Error("Wallet not connected");
    const devWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    if (!devWallet) throw new Error("Developer wallet address is not set");

    const signer = await getSigner();
    const tokenContract = getTokenContract(signer);
    
    // Step 1: Transfer tokens
    const tx1 = await tokenContract.transfer(devWallet, ethers.parseUnits(amount, 18));
    await tx1.wait();
    console.log("Tokens transferred!");

    // Step 2: Mint NFT immediately after payment
    console.log("Minting NFT...");
    await mintNFT(walletAddress.toString(), metadataURI);
    alert("Character purchased and NFT minted successfully!");
    fetchBalance(walletAddress);
    return({message:'TSSuccess'})
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction failed!");
    return({message:'TSFailed'})
  }
};


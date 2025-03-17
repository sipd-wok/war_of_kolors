import { ethers } from "ethers";
import { getSigner } from "@/utils/ethersProvider";
import { getTokenContract } from "@/utils/tokencontract";
import { mintNFT } from "./nftTransactions";
export const sendTokens = async (
  recipient: string,
  amount: string,
  walletAddress: string,
  fetchBalance: (address: string) => void,
) => {
  try {
    const signer = await getSigner();
    const contract = getTokenContract(signer);
    const tx = await contract.transfer(
      recipient,
      ethers.parseUnits(amount, 18),
    );
    await tx.wait();

    alert("Transaction Successful!");
    fetchBalance(walletAddress);
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction Failed!");
  }
};

export const shopPayment = async (
  amount: string,
  walletAddress: string,
  fetchBalance: (address: string) => void,
) => {
  console.log(amount, walletAddress, fetchBalance(walletAddress));
  try {
    if (!walletAddress) throw new Error("Wallet not connected");
    const devWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    if (!devWallet) throw new Error("Developer wallet address is not set");

    const signer = await getSigner();
    const contract = getTokenContract(signer);
    const tx = await contract.transfer(
      devWallet,
      ethers.parseUnits(amount, 18),
    );
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
  fetchBalance: (address: string) => void,
) => {
  try {
    if (!walletAddress) throw new Error("Wallet not connected");
    const devWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
    if (!devWallet) throw new Error("Developer wallet address is not set");

    const signer = await getSigner();
    const tokenContract = getTokenContract(signer);
    const tx1 = await tokenContract.transfer(
      devWallet,
      ethers.parseUnits(amount, 18),
    );
    await tx1.wait();
    const mintResult = await mintNFT(walletAddress.toString(), metadataURI);

    if (!mintResult || mintResult.success === false) {
      console.error("Transaction Failed:", mintResult);
      return { message: "TSFailed", tokenId: "" };
    }
    fetchBalance(walletAddress);
    return { message: "TSSuccess", tokenId: mintResult.tokenId };
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    return { message: "TSFailed", tokenId: "" };
  }
};


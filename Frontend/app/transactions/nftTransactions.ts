import { getSigner } from "@/utils/ethersProvider";
import { getNFTContract } from "@/utils/nftcontract";
import { ethers } from "ethers";

export const mintNFT = async (walletAddress: string, metadataURI: string) => {
  console.log(metadataURI, walletAddress);
  try {
    if (!walletAddress) throw new Error("Wallet not connected");
    const signer = await getSigner();
    const contract = getNFTContract(signer);
    const tx = await contract.mint(walletAddress, metadataURI);
    const receipt = await tx.wait(); 
    const transferEventTopic = ethers.id("Transfer(address,address,uint256)");
    const event = receipt.logs.find((log: { topics: string[]; }) => log.topics[0] === transferEventTopic);
    if (!event) throw new Error("Transfer event not found");
    const tokenId = BigInt(event.topics[3]).toString();
    return { success: true, tokenId };
  } catch (error) {
    console.error("NFT Minting Failed:", error);
    alert("NFT Minting Failed!");
    return { success: false, tokenId: null };
  }
};
export const transferNFT = async (
  from: string,
  to: string,
  tokenId: string,
) => {
  try {
    const signer = await getSigner();
    const contract = getNFTContract(signer);

    const tx = await contract.transferFrom(from, to, tokenId);
    await tx.wait();

    alert("NFT Transferred Successfully!");
  } catch (error) {
    console.error("NFT Transfer Failed:", error);
    alert("NFT Transfer Failed!");
  }
};

import { getSigner } from "@/utils/ethersProvider";
import { getNFTContract } from "@/utils/nftcontract";
import { ethers } from "ethers";

export const mintNFT = async (walletAddress: string, metadataURI: string) => {
  try {
    if (!walletAddress) throw new Error("Wallet not connected");
    const signer = await getSigner();
    const contract = getNFTContract(signer);
    const tx = await contract.mint(walletAddress, metadataURI);
    const receipt = await tx.wait();
    const transferEventTopic = ethers.id("Transfer(address,address,uint256)");
    const event = receipt.logs.find(
      (log: { topics: string[] }) => log.topics[0] === transferEventTopic,
    );
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
): Promise<boolean> => {
  try {
    console.log(from, to, tokenId);
    const signer = await getSigner();
    const contract = getNFTContract(signer);
    const tx = await contract["safeTransferFrom"](from, to, tokenId);
    await tx.wait();

    console.log(`NFT ${tokenId} transferred from ${from} to ${to}`);
    return true;
  } catch (error) {
    console.error("NFT Transfer Failed:", error);
    return false;
  }
};

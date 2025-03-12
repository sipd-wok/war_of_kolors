import { getSigner } from "@/utils/ethersProvider";
import { getNFTContract } from "@/utils/nftcontract";

export const mintNFT = async (walletAddress: string, metadataURI: string) => {
  console.log(metadataURI, walletAddress);
  try {
    if (!walletAddress) throw new Error("Wallet not connected");

    const signer = await getSigner();
    const contract = getNFTContract(signer);

    const tx = await contract.mint(walletAddress, metadataURI);
    await tx.wait();

    alert("NFT Minted Successfully!");
  } catch (error) {
    console.error("NFT Minting Failed:", error);
    alert("NFT Minting Failed!");
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

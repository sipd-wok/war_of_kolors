import { ethers } from "ethers";
import contractABI from "../contracts/WokNFT.json"; // Adjust path if needed

const contractAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS; 

export const getNFTContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(contractAddress as string, contractABI.abi, providerOrSigner);
};

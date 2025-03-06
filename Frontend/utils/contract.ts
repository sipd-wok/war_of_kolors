import { ethers } from "ethers";
import contractABI from "../contracts/WokToken.json"; // Adjust path if needed

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; 

export const getContract = (
  providerOrSigner: ethers.Provider | ethers.Signer,
) => {
  return new ethers.Contract(
    contractAddress as string,
    contractABI.abi,
    providerOrSigner,
  );
};

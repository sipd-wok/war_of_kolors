"use client"; // ✅ Required for client components

// import { useState } from "react";
// import ConnectWallet from "@/components/WalletButton";
// import CheckBalance from "@/components/CheckBalance"; // Ensure this is a valid component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetaMaskSignIn } from "@/components/auth/MetaMaskSignIn";
import { GuestSignIn } from "@/components/auth/GuestSignIn";
export default function Home() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    if (walletConnected) {
      router.push("/signIn");
    }
  }, [walletConnected]);
  return (
    <div className="w-full max-w-sm mx-auto space-y-6 h-screen grid place-content-center">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      <MetaMaskSignIn setWalletConnected={setWalletConnected} />
      <GuestSignIn />
    </div>
  );
}
// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { useWallet } from "@/context/WalletContext";

// const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
// const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// const MintNFT = () => {
//   const { mintNFT } = useWallet();
//   const [file, setFile] = useState(null);
//   const [ipfsHash, setIpfsHash] = useState("");
//   const [minting, setMinting] = useState(false);
//   const [walletAddress, setWalletAddress] = useState(
//     "0x2fC625C6D97af5aF6f8199E7c1198889ad400Ae6"
//   );

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const uploadToPinata = async () => {
//     if (!file) return alert("Please select an image.");

//     const formData = new FormData();
//     formData.append("file", file, file.name); // ✅ Ensure file has a name

//     try {
//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             pinata_api_key: pinataApiKey,
//             pinata_secret_api_key: pinataSecretApiKey,
//           },
//         }
//       );

//       const hash = res.data.IpfsHash;
//       const imageURI = `https://bronze-active-seahorse-192.mypinata.cloud/ipfs/${hash}`; // ✅ Use proper IPFS gateway link
//       setIpfsHash(imageURI);
//       return imageURI;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Image upload failed!");
//       return null;
//     }
//   };

//   const mint = async () => {
//     if (!walletAddress) return alert("Enter your wallet address");
//     setMinting(true);

//     const imageURI = await uploadToPinata();
//     if (!imageURI) {
//       setMinting(false);
//       return;
//     }

//     // ✅ Generate correct metadata JSON
//     const metadata = {
//       name: "My NFT",
//       description: "An NFT minted on Core DAO",
//       image: imageURI, // ✅ Use full gateway link
//     };

//     try {
//       // Upload metadata to Pinata
//       const metadataRes = await axios.post(
//         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         metadata,
//         {
//           headers: {
//             pinata_api_key: pinataApiKey,
//             pinata_secret_api_key: pinataSecretApiKey,
//           },
//         }
//       );

//       const metadataURI = `https://bronze-active-seahorse-192.mypinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
//       console.log(metadata, "metadata");
//       console.log(metadataURI, "metadataURI")
//       // Mint the NFT
//       await mintNFT(walletAddress, metadataURI);
//       alert("NFT Minted Successfully!");
//     } catch (error) {
//       console.error("Error minting NFT:", error);
//       alert("NFT Minting Failed!");
//     }

//     setMinting(false);
//   };

//   return (
//     <div>
//       <h2>Mint NFT on Core DAO</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={mint} disabled={minting}>
//         {minting ? "Minting..." : "Mint NFT"}
//       </button>
//     </div>
//   );
// };

// export default MintNFT;

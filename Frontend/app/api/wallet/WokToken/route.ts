import { ethers } from "ethers";
import { NextResponse } from "next/server";

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const privateKey = process.env.WALLET_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Missing WALLET_PRIVATE_KEY in environment variables");
}
const wallet = new ethers.Wallet(privateKey, provider);

const erc20ABI = [
  "function mint(address to, uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

const wokContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  erc20ABI,
  wallet
);

export async function POST(request: Request) {
  try {
    const { recipient } = await request.json();
    // const mintAmount = "1000000000";
    const transferAmount = "1000000";

    // Mint tokens to the sender (your wallet)
    // const mintTx = await wokContract.mint(
    //   wallet.address, 
    //   ethers.parseUnits(mintAmount, 18), 
    // );
    // await mintTx.wait();
    const transferTx = await wokContract.transfer(recipient, ethers.parseUnits(transferAmount, 18));
    await transferTx.wait();

    return NextResponse.json({ success: true, recipient });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json({ error: "Failed to send transaction" }, { status: 500 });
  }
}

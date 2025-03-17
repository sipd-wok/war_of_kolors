import { ethers } from "ethers";
import { NextResponse } from "next/server";

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const privateKey = process.env.WALLET_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Missing WALLET_PRIVATE_KEY in environment variables");
}
const wallet = new ethers.Wallet(privateKey, provider);

const erc20ABI = [
  "function balanceOf(address account) external view returns (uint256)", // ✅ Add this
  "function mint(address to, uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)",
];

const devWallet = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
const wokContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  erc20ABI,
  wallet,
);

export async function POST(request: Request) {
  try {
    const { type, recipient, amount } = await request.json();
    if (type === "mint") {
      const mintAmount = "100000000000";
      const mintTx = await wokContract.mint(
        wallet.address,
        ethers.parseUnits(mintAmount, 18),
      );
      await mintTx.wait();
      return NextResponse.json({ success: true, message: "Mint Successful" });
    }
    if (type === "transfer") {
      const transferAmount = "1000000";
      const transferTx = await wokContract.transfer(
        recipient,
        ethers.parseUnits(transferAmount, 18),
      );
      await transferTx.wait();
      return NextResponse.json({ success: true, message: "Tranfer Success" });
    }
    if (type === "payment") {
      const balance = await wokContract.balanceOf(recipient);
      console.log(balance);
      if (balance < ethers.parseUnits(amount, 18)) {
        console.log("Balance is insufficient");
        return NextResponse.json({
          success: false,
          message: "Insufficient balance",
        });
      }

      const paymentTx = await wokContract.transfer(
        devWallet,
        ethers.parseUnits(amount, 18),
      );
      await paymentTx.wait();
      return NextResponse.json({ success: true, message: "Payment Success" });
    }
    return NextResponse.json(
      { error: "Invalid transaction type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { error: "Failed to send transaction" },
      { status: 500 },
    );
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get("recipient");

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient is required" },
        { status: 400 },
      );
    }

    const rawBalance = await wokContract.balanceOf(recipient);
    const formattedBalance = ethers.formatUnits(rawBalance, 18);
    const formattedWithCommas = Number(formattedBalance).toLocaleString();

    return NextResponse.json({
      success: true,
      balance: formattedWithCommas.toLocaleString(),
    });
  } catch (error) {
    console.error("Fetching Balance failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import supabase from "@/lib/db/db";
import { ethers } from "ethers";
const WOK_REWARD_AMOUNT = "1000000"; 
export async function GET(
  request: Request,
  { params }: { params: { walletaddress: string } },
) {
  try {
    // api/requestWok/[walletaddress]
    // ma kwa ya na dayun ang wallet address halin sa url
    const walletAddress = params.walletaddress;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 },
      );
    }

    // Check if wallet has already requested tokens in the past 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data: existingRequest, error: lookupError } = await supabase
      .from("wok_requests_tbl")
      .select("*")
      .eq("wallet_address", walletAddress)
      .gte("requested_at", twentyFourHoursAgo.toISOString())
      .limit(1);

    if (lookupError) {
      console.error("Error checking request history:", lookupError);
      return NextResponse.json(
        { error: "Failed to check request history" },
        { status: 500 },
      );
    }

    // If there's a recent request, deny the new one
    if (existingRequest && existingRequest.length > 0) {
      const lastRequestTime = new Date(existingRequest[0].requested_at);
      const nextAvailableTime = new Date(lastRequestTime);
      nextAvailableTime.setHours(nextAvailableTime.getHours() + 24);

      return NextResponse.json(
        {
          error: "Please wait 24 hours between requests",
          lastRequest: lastRequestTime,
          nextAvailable: nextAvailableTime,
        },
        { status: 429 }, // Too Many Requests status code
      );
    }

    // Initialize the connection to the blockchain
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL,
    );
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "Server wallet configuration error" },
        { status: 500 },
      );
    }

    const wallet = new ethers.Wallet(privateKey, provider);

    const erc20ABI = [
      "function mint(address to, uint256 amount) external",
      "function transfer(address to, uint256 amount) external returns (bool)",
    ];

    const wokContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      erc20ABI,
      wallet,
    );

    try {
      // Send the tokens to the requester
      const tx = await wokContract.transfer(
        walletAddress,
        ethers.parseUnits(WOK_REWARD_AMOUNT, 18),
      );

      await tx.wait();

      // Record the successful request
      const { error: insertError } = await supabase
        .from("wok_requests_tbl")
        .insert({
          wallet_address: walletAddress,
          amount: WOK_REWARD_AMOUNT,
          tx_hash: tx.hash,
        });

      if (insertError) {
        console.error("Error recording request:", insertError);
        return NextResponse.json(
          { error: "Tokens sent but failed to record request" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: `${WOK_REWARD_AMOUNT} WOK tokens sent successfully`,
        walletAddress: walletAddress,
        txHash: tx.hash,
      });
    } catch (txError) {
      console.error("Transaction error:", txError);
      return NextResponse.json(
        { error: "Failed to send WOK tokens" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

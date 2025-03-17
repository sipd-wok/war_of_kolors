import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterID = searchParams.get("characterID");

    const { data: character, error: lookupError } = await supabase
      .from("characters_tbl")
      .select("*")
      .eq("id", characterID)
      .limit(1);

    if (lookupError) {
      console.error("Error fetching WOK Character:", lookupError);
      return NextResponse.json(
        { error: "Error fetching WOK Character" },
        { status: 500 },
      );
    }

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Unexpected error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

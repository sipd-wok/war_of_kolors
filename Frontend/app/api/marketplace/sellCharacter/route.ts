import { auth } from "../../../../lib/auth";
import supabase from "../../../../lib/db/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get character data from request
    const { character_id, price, currency } = await request.json();

    if (!character_id || !price || !currency) {
      return NextResponse.json(
        { error: "Missing required fields: character_id, price, or currency" },
        { status: 400 },
      );
    }

    // Get user session server-side
    const session = await auth();
    const user_id = session?.user?.user_id;

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, check if character exists and belongs to this user
    const { data: character, error: characterError } = await supabase
      .from("characters_tbl") // Make sure this matches your table name
      .select("id")
      .eq("id", character_id)
      .single();

    if (characterError || !character) {
      return NextResponse.json(
        { error: characterError?.message || "Character not found" },
        { status: 404 },
      );
    }

    const { data: user, error: ownerError } = await supabase
      .from("users_tbl")
      .select("id")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (ownerError) {
      return NextResponse.json(
        { error: ownerError.message || "Failed to fetch user" },
        { status: 500 },
      );
    }

    // Check if character is already listed in marketplace
    const { data: existingListing, error: listingError } = await supabase
      .from("marketplace_tbl")
      .select("id")
      .eq("item_id", character_id)
      .limit(1);

    if (listingError) {
      return NextResponse.json(
        { error: listingError.message },
        { status: 500 },
      );
    }

    if (existingListing && existingListing.length > 0) {
      return NextResponse.json(
        { error: "Character is already listed in the marketplace" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("marketplace_tbl").insert({
      owner_id: user.id,
      item_id: character_id,
      price,
      currency,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to list character in marketplace" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Character successfully listed in marketplace",
    });
  } catch (error) {
    console.error("Sell character error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to list in the marketplace.",
      },
      { status: 500 },
    );
  }
}

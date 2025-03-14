import { auth } from "../../../../lib/auth";
import supabase from "../../../../lib/db/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get character data from request
    const { character_id, price, currency } = await request.json();

    // Enhanced validation
    if (!character_id) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 },
      );
    }

    if (!price) {
      return NextResponse.json({ error: "Price is required" }, { status: 400 });
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 },
      );
    }

    if (!currency || currency !== "WoK") {
      return NextResponse.json(
        { error: "Currency must be WoK" },
        { status: 400 },
      );
    }

    // Get user session server-side
    const session = await auth();
    const user_id = session?.user?.user_id;

    if (!user_id) {
      return NextResponse.json(
        { error: "You must be logged in to list an item for sale" },
        { status: 401 },
      );
    }

    // First, check if character exists
    const { data: character, error: characterError } = await supabase
      .from("characters_tbl")
      .select("id, on_sale, owner_id")
      .eq("id", character_id)
      .single();

    if (characterError) {
      console.error("Character fetch error:", characterError);
      return NextResponse.json(
        { error: "Failed to fetch character data" },
        { status: 500 },
      );
    }

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 },
      );
    }

    // Get the internal user ID
    const { data: user, error: ownerError } = await supabase
      .from("users_tbl")
      .select("id")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (ownerError) {
      console.error("User fetch error:", ownerError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 },
      );
    }

    // Check if the character belongs to this user
    if (character.owner_id !== user.id) {
      return NextResponse.json(
        { error: "You don't own this character" },
        { status: 403 },
      );
    }

    // Check if the character is already for sale
    if (character.on_sale) {
      return NextResponse.json(
        { error: "This character is already listed for sale" },
        { status: 400 },
      );
    }

    // Check if character is already listed in marketplace
    const { data: existingListing, error: listingError } = await supabase
      .from("marketplace_tbl")
      .select("id")
      .eq("item_id", character_id)
      .limit(1);

    if (listingError) {
      console.error("Marketplace check error:", listingError);
      return NextResponse.json(
        { error: "Failed to check marketplace listing status" },
        { status: 500 },
      );
    }

    if (existingListing && existingListing.length > 0) {
      return NextResponse.json(
        { error: "Character is already listed in the marketplace" },
        { status: 400 },
      );
    }

    // Add item to marketplace
    const { error: insertError } = await supabase
      .from("marketplace_tbl")
      .insert({
        owner_id: user.id,
        item_id: character_id,
        price,
        currency,
      });

    if (insertError) {
      console.error("Marketplace insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to add character to marketplace" },
        { status: 500 },
      );
    }

    // Update character's for_sale status
    const updateResult = await supabase
      .from("characters_tbl")
      .update({ on_sale: true })
      .eq("id", character_id)
      .select();

    console.log("Update result:", updateResult);
    const { error: updateError } = updateResult;

    if (updateError) {
      console.error("Character update error:", updateError);

      // Try to rollback the marketplace insertion if character update fails
      await supabase
        .from("marketplace_tbl")
        .delete()
        .eq("item_id", character_id);

      return NextResponse.json(
        { error: "Failed to update character sale status" },
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
            : "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}

import supabase from "../../../../lib/db/db";
import { NextResponse } from "next/server";

class WOKCharacter {
  id!: string;
  owner_id!: string;
  owner_username?: string;
  color!: string;
  luck!: number;
  sprite!: string;
  name!: string;
  tier!: string;
  on_sale!: boolean;
  price!: number;
  currency!: string;
  games_played!: number;
  games_won!: number;

  constructor() {
    this.id = "";
    this.owner_id = "";
    this.owner_username = "";
    this.color = "";
    this.luck = 0;
    this.sprite = "";
    this.name = "";
    this.tier = "";
    this.on_sale = false;
    this.price = 0;
    this.currency = "";
    this.games_played = 0;
    this.games_won = 0;
  }
}

export async function GET() {
  try {
    // Get all items for sale from marketplace
    const { data: marketplaceItems, error: marketplaceError } = await supabase
      .from("marketplace_tbl")
      .select("id, item_id, owner_id, price, currency");

    if (marketplaceError) {
      return NextResponse.json(
        { error: marketplaceError.message },
        { status: 500 },
      );
    } else if (!marketplaceItems) {
      console.error("No marketplace items found");
      return NextResponse.json({ characters: [] });
    }

    // Map marketplace items to WOKCharacter instances
    const characters: WOKCharacter[] = [];

    // Process each marketplace item
    for (const item of marketplaceItems || []) {
      // Get character details using item_id
      const { data: characterData, error: characterError } = await supabase
        .from("characters_tbl")
        .select("*")
        .eq("id", item.item_id)
        .single();

      if (characterError) {
        console.error(
          `Error fetching character ${item.item_id}:`,
          characterError,
        );
        continue;
      }

      // Get owner username using owner_id
      const { data: userData, error: userError } = await supabase
        .from("users_tbl")
        .select("username")
        .eq("id", item.owner_id)
        .single();

      if (userError) {
        console.error(`Error fetching user ${item.owner_id}:`, userError);
      }

      // Create a new character instance
      const character = new WOKCharacter();

      // Map character properties
      character.id = characterData.id || "";
      character.owner_id = item.owner_id || "";
      character.owner_username = userData?.username || "Unknown";
      character.color = characterData.color || "";
      character.luck = characterData.luck || 0;
      character.sprite = characterData.sprite || "";
      character.name = characterData.name || "";
      character.tier = characterData.tier || "";
      character.on_sale = true; // Since it's in the marketplace
      character.price = item.price || 0;
      character.currency = item.currency || "WOK";
      character.games_played = characterData.games_played || 0;
      character.games_won = characterData.games_won || 0;

      characters.push(character);
    }

    return NextResponse.json({ characters });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get marketplace items" },
      { status: 500 },
    );
  }
}

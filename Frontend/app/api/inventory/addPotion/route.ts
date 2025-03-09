import { auth } from "../../../../lib/auth";
import supabase from "../../../../lib/db/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { potionName, quantity } = await request.json();
    // Get user session server-side
    const session = await auth();
    const user_id = session?.user?.user_id;

    console.log("Session user_id: " + user_id);
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User " + user_id);
    const { data: user, error: ownerError } = await supabase
      .from("users_tbl")
      .select("id")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (ownerError) {
      return NextResponse.json({ error: ownerError.message }, { status: 500 });
    }

    let fieldName = "";
    if (potionName === "Health Potion") {
      fieldName = "hp";
    } else if (potionName === "Leprechaun's Potion") {
      fieldName = "leprechaun";
    } else if (potionName === "Devil's Potion") {
      fieldName = "devil";
    }

    // fetch current inventory with all fields
    console.log("Searching for potions with owner_id: " + user.id);
    const { data: potions, error } = await supabase
      .from("potions_tbl")
      .select("*")
      .eq("owner_id", user.id)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!potions) {
      console.log("No potions found, creating new inventory");
      const { error: addPotionError, data: newPotion } = await supabase
        .from("potions_tbl")
        .insert({
          owner_id: user.id,
          [fieldName]: quantity,
        })
        .select()
        .single();

      if (addPotionError) {
        return NextResponse.json(
          { error: addPotionError.message },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true, potion: newPotion });
    }

    console.log("Potions found, updating inventory");
    // Get the current quantity, default to 0 if it doesn't exist
    const currentQuantity = potions[fieldName] || 0;

    const { error: updateError, data: updatedPotion } = await supabase
      .from("potions_tbl")
      .update({
        [fieldName]: currentQuantity + quantity,
      })
      .eq("owner_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log("Updated potions: ", updatedPotion);
    return NextResponse.json({ success: true, potion: updatedPotion });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 },
    );
  }
}

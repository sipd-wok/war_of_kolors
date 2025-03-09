import { auth } from "@/lib/auth";
import supabase from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get user session server-side
    const session = await auth();
    const user_id = session?.user?.user_id;

    console.log("Session user_id: " + user_id);
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user's ID in the users table
    const { data: user, error: userError } = await supabase
      .from("users_tbl")
      .select("id")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the potions for this user
    console.log("Searching for potions with owner_id: " + user.id);
    const { data: potions, error: potionsError } = await supabase
      .from("potions_tbl")
      .select("*")
      .eq("owner_id", user.id)
      .limit(1)
      .single();

    // If no potions found or there's an error (except for "no rows")
    if (potionsError) {
      if (potionsError.code === "PGRST116") {
        // "no rows returned" error
        // Return empty potions object with zero counts
        return NextResponse.json({
          potions: {
            hp: 0,
            leprechaun: 0,
            devil: 0,
          },
        });
      }
      return NextResponse.json(
        { error: potionsError.message },
        { status: 500 },
      );
    }

    // Return the potions data
    return NextResponse.json({ potions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 },
    );
  }
}

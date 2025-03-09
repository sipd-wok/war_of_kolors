import { auth } from "../../../lib/auth";
import supabase from "../../../lib/db/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get character data from request
    const { tier, color, luck, sprite, name } = await request.json();
    console.log("Recieved payload: " + tier, color, luck, sprite, name);

    // Get user session server-side
    const session = await auth();
    const user_id = session?.user?.user_id;

    console.log("Session user_id: " + user_id);
    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching primary key of: " + user_id);
    const { data: user, error: ownerError } = await supabase
      .from("users_tbl")
      .select("id")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (ownerError) {
      return NextResponse.json({ error: ownerError.message }, { status: 500 });
    }

    // Insert character into database
    console.log("The owner pk is: " + user.id);
    console.log("Insert character into database");
    const { error } = await supabase.from("characters_tbl").insert({
      owner_id: user.id,
      tier,
      color,
      luck,
      sprite,
      name,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 },
    );
  }
}

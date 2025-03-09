import { auth } from "../../../lib/auth";
import supabase from "../../../lib/db/db";
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

    // fetch all the owned characters
    console.log("Searching for characters with owner_id: " + user.id);
    const { data: characters, error } = await supabase
      .from("characters_tbl")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Characters: ", characters);

    return NextResponse.json({ characters });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 },
    );
  }
}

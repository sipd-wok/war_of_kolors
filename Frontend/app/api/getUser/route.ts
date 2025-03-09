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
      .select("id, user_id, username")
      .eq("user_id", user_id)
      .limit(1)
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

"use server";

import { auth } from "../auth";
import supabase from "../db/db";
import { revalidatePath } from "next/cache";

export async function updateUsername(username: string) {
  const session = await auth();

  if (!session?.user?.user_id) {
    throw new Error("User ID not found in session");
  }

  // Update the username in the database
  const { error } = await supabase
    .from("users_tbl")
    .update({ username })
    .eq("user_id", session.user.user_id);

  if (error) {
    throw new Error(error.message);
  }

  // Force revalidation of the session by clearing the cache for relevant paths
  revalidatePath("/MainGame");
  revalidatePath("/welcome");

  return { success: true };
}

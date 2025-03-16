"use server";

import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import { v4 as uuidv4 } from "uuid";
import supabase from "../db/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function metaMaskSignInAction(address: string) {
  const session = await auth();

  if (session) redirect("/welcome");

  return await executeAction({
    actionFn: async () => {
      const { data, error } = await supabase
        .from("users_tbl")
        .select("username, password")
        .eq("user_id", address)
        .single();

      if (data) {
        await signIn("credentials", {
          user_id: address,
          password: data.password,
          role_id: "2",
        });
      } else if (!data || error) {
        await signIn("credentials", {
          user_id: address,
          password: uuidv4(),
          role_id: "2",
        });
      } else {
        throw new Error("Error signing in.");
      }
    },
  });
}

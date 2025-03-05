"use server";

import { signIn } from "@/lib/auth";
import { executeAction } from "@/lib/executeAction";
import { v4 as uuidv4 } from "uuid";
import supabase from "../db/db";

export async function metaMaskSignInAction(address: string) {
  return await executeAction({
    actionFn: async () => {
      const { data, error } = await supabase
        .from("users_tbl")
        .select("username, password")
        .eq("user_id", address)
        .single();

      if (data) {
        await signIn("credentials", {
          userID: address,
          password: data.password,
          role: "player",
        });
      } else if (!data || error) {
        await signIn("credentials", {
          userID: address,
          password: uuidv4(),
          role: "player",
        });
      } else {
        throw new Error("Error signing in.");
      }
    },
  });
}

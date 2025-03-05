"use server";

// import { executeAction } from "@/lib/executeAction";
import supabase from "../db/db";

export async function testFetchData() {
  //   return await executeAction({
  // actionFn: async () => {
  console.log("fetching db");
  const { data, error } = await supabase.from("users_tbl").select();
  if (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
  return data;
  // },
  // });
}

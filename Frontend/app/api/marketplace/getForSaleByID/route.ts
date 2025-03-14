import supabase from "../../../../lib/db/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { character_id } = await request.json();

    const { data: saleDetails, error } = await supabase
      .from("marketplace_tbl")
      .select("price, currency")
      .eq("item_id", character_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saleDetails });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get sale details" },
      { status: 500 },
    );
  }
}

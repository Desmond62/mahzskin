import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = createClient();
    // Simple lightweight query to keep the project active
    await supabase.from("products").select("id").limit(1);
    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Keep-alive failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("photos")
    .select("id, public_url, uploader_name, uploaded_at, file_size_bytes")
    .order("uploaded_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }

  return NextResponse.json({ photos: data });
}

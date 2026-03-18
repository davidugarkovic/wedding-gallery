import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { isAdminAuthenticated } from "@/lib/auth";
import { BUCKET_NAME } from "@/lib/constants";

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createServerClient();

  // Fetch storage path
  const { data, error: fetchError } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !data) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([data.storage_path]);

  if (storageError) {
    console.error("Storage delete error:", storageError);
  }

  // Delete DB row
  const { error: dbError } = await supabase.from("photos").delete().eq("id", id);
  if (dbError) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

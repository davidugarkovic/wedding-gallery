import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { BUCKET_NAME, MAX_FILES_PER_UPLOAD, MAX_FILE_SIZE_MB, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_HOURS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  // Parse form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const uploaderName = (formData.get("uploaderName") as string | null)?.trim() ?? "";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large (max ${MAX_FILE_SIZE_MB}MB)` }, { status: 400 });
  }

  // Rate limiting by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true })
    .eq("uploader_ip", ip)
    .gte("uploaded_at", windowStart);

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Generate unique storage path
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).slice(2, 9);
  const storagePath = `photos/${timestamp}-${randomId}.jpg`;

  // Upload to Supabase Storage
  const bytes = await file.arrayBuffer();
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, bytes, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (storageError) {
    console.error("Storage upload error:", storageError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  // Insert metadata row
  const { error: dbError } = await supabase.from("photos").insert({
    storage_path: storagePath,
    public_url: publicUrl,
    uploader_name: uploaderName || null,
    uploader_ip: ip,
    file_size_bytes: file.size,
  });

  if (dbError) {
    console.error("DB insert error:", dbError);
    // Don't fail the request — photo is already stored
  }

  return NextResponse.json({ url: publicUrl });
}

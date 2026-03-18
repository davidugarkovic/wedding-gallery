"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhotoGrid from "@/components/PhotoGrid";
import { S } from "@/lib/strings";
import { WEDDING_NAMES } from "@/lib/constants";

interface Photo {
  id: string;
  public_url: string;
  uploader_name: string | null;
  uploaded_at: string;
  file_size_bytes: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch("/api/photos")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setPhotos(data.photos ?? []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    setDownloading(true);

    // Dynamic import to keep bundle small
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const folder = zip.folder("venčanje-fotografije")!;

    await Promise.all(
      photos.map(async (photo, i) => {
        try {
          const res = await fetch(photo.public_url);
          const blob = await res.blob();
          const ext = "jpg";
          const name = photo.uploader_name
            ? `${i + 1}-${photo.uploader_name.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`
            : `${i + 1}-fotografija.${ext}`;
          folder.file(name, blob);
        } catch {
          // Skip failed photos
        }
      })
    );

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "venčanje-fotografije.zip";
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const totalMB = (
    photos.reduce((sum, p) => sum + (p.file_size_bytes ?? 0), 0) /
    1024 /
    1024
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-stone-100 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1
              className="text-xl font-light tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {WEDDING_NAMES}
            </h1>
            {!loading && (
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {S.adminPhotosCount(photos.length)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              disabled={downloading || photos.length === 0}
              className="text-sm px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              {downloading ? S.downloading : S.downloadAll}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-stone-400 hover:text-stone-600 px-2 py-1.5"
            >
              {S.logoutButton}
            </button>
          </div>
        </div>
        {!loading && photos.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-2">
            <p className="text-xs text-stone-400">{S.storageUsed(totalMB)}</p>
          </div>
        )}
      </header>

      {/* Gallery */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20 text-stone-400">
            <div className="animate-pulse text-3xl mb-3">📷</div>
            <p className="text-sm">{S.uploading}</p>
          </div>
        ) : (
          <PhotoGrid photos={photos} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

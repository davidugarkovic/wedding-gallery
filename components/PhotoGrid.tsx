"use client";

import { useState } from "react";
import { S } from "@/lib/strings";

interface Photo {
  id: string;
  public_url: string;
  uploader_name: string | null;
  uploaded_at: string;
  file_size_bytes: number;
}

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (id: string) => void;
}

export default function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (photo: Photo) => {
    setDownloading(photo.id);
    try {
      const res = await fetch(photo.public_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = photo.uploader_name
        ? `${photo.uploader_name.replace(/[^a-zA-Z0-9]/g, "_")}-${photo.id.slice(0, 6)}.jpg`
        : `fotografija-${photo.id.slice(0, 6)}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
    setDownloading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(S.confirmDelete)) return;
    setDeleting(id);
    const res = await fetch("/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onDelete(id);
    }
    setDeleting(null);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <div className="text-4xl mb-3">📷</div>
        <p>{S.noPhotos}</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative break-inside-avoid group">
            <img
              src={photo.public_url}
              alt={photo.uploader_name ?? "Fotografija"}
              className="w-full rounded-lg cursor-pointer object-cover transition-opacity group-hover:opacity-90"
              onClick={() => setLightbox(photo.public_url)}
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors pointer-events-none" />
            {/* Download button */}
            <button
              onClick={() => handleDownload(photo)}
              disabled={downloading === photo.id}
              className="absolute top-2 left-2 bg-white/80 hover:bg-white text-stone-700 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              title="Preuzmi fotografiju"
            >
              {downloading === photo.id ? "…" : "↓"}
            </button>
            {/* Delete button */}
            <button
              onClick={() => handleDelete(photo.id)}
              disabled={deleting === photo.id}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-stone-700 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              {deleting === photo.id ? "…" : S.deleteButton}
            </button>
            {/* Uploader name */}
            {photo.uploader_name && (
              <div className="absolute bottom-2 left-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.uploader_name}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Fotografija"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

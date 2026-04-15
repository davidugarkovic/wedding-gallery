"use client";

import { useState } from "react";
import { S } from "@/lib/strings";

interface SuccessMessageProps {
  uploadedUrls: string[];
  onUploadMore: () => void;
}

export default function SuccessMessage({ uploadedUrls, onUploadMore }: SuccessMessageProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="text-center">
      <div className="text-gold text-2xl mb-4 tracking-[0.4em]">✦</div>
      <p className="text-lg font-semibold text-stone-700 mb-1">{S.uploadSuccess}</p>

      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-stone-500 mb-3 font-medium tracking-wide uppercase">
            {S.yourPhotos}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {uploadedUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Fotografija ${i + 1}`}
                className="w-full aspect-square object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setLightbox(url)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onUploadMore}
        className="mt-8 px-6 py-3 border border-gold-light text-stone-600 rounded-full text-sm hover:bg-gold-light/20 transition-colors"
      >
        {S.uploadMore}
      </button>

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
    </div>
  );
}

"use client";

import { S } from "@/lib/strings";

interface SuccessMessageProps {
  uploadedUrls: string[];
  onUploadMore: () => void;
}

export default function SuccessMessage({ uploadedUrls, onUploadMore }: SuccessMessageProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">💐</div>
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
                className="w-full aspect-square object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onUploadMore}
        className="mt-8 px-6 py-3 border border-stone-300 text-stone-600 rounded-full text-sm hover:bg-stone-50 transition-colors"
      >
        {S.uploadMore}
      </button>
    </div>
  );
}

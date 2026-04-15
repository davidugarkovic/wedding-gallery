"use client";

import { S } from "@/lib/strings";

interface ProgressBarProps {
  progress: number; // 0-100
  filename: string;
  status: "pending" | "compressing" | "uploading" | "done" | "error";
  errorMessage?: string;
  previewUrl?: string;
}

export default function ProgressBar({
  progress,
  filename,
  status,
  errorMessage,
  previewUrl,
}: ProgressBarProps) {
  const label =
    status === "done"
      ? "✓"
      : status === "error"
      ? "✗"
      : status === "compressing"
      ? S.preparingFile
      : `${progress}%`;

  const barColor =
    status === "done"
      ? "bg-gold"
      : status === "error"
      ? "bg-red-400"
      : "bg-gold";

  return (
    <div className="flex items-center gap-3 py-2">
      {previewUrl && (
        <img
          src={previewUrl}
          alt={filename}
          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-stone-500 truncate pr-2">{filename}</span>
          <span className="text-xs text-stone-400 flex-shrink-0">{label}</span>
        </div>
        <div className="h-1.5 bg-gold-light/40 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        {status === "error" && errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

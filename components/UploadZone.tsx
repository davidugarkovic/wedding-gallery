"use client";

import { useRef, useState, useCallback } from "react";
import { compressImage } from "@/lib/compress";
import { S } from "@/lib/strings";
import { MAX_FILES_PER_UPLOAD, MAX_FILE_SIZE_MB } from "@/lib/constants";
import ProgressBar from "./ProgressBar";
import SuccessMessage from "./SuccessMessage";

interface FileState {
  file: File;
  previewUrl: string;
  progress: number;
  status: "pending" | "compressing" | "uploading" | "done" | "error";
  errorMessage?: string;
  uploadedUrl?: string;
}

export default function UploadZone() {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploaderName, setUploaderName] = useState("");
  const [files, setFiles] = useState<FileState[]>([]);
  const [phase, setPhase] = useState<"idle" | "preview" | "uploading" | "done">("idle");
  const [globalError, setGlobalError] = useState("");

  const validateFiles = (selected: File[]): { valid: File[]; error: string } => {
    if (selected.length > MAX_FILES_PER_UPLOAD) {
      return { valid: [], error: S.errorTooMany(MAX_FILES_PER_UPLOAD) };
    }
    const valid: File[] = [];
    for (const f of selected) {
      if (!f.type.startsWith("image/")) {
        return { valid: [], error: S.errorFileType };
      }
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return { valid: [], error: S.errorFileSize(MAX_FILE_SIZE_MB) };
      }
      valid.push(f);
    }
    return { valid, error: "" };
  };

  const handleFilesSelected = useCallback((selected: FileList | null) => {
    if (!selected || selected.length === 0) return;
    setGlobalError("");

    const { valid, error } = validateFiles(Array.from(selected));
    if (error) {
      setGlobalError(error);
      return;
    }

    const fileStates: FileState[] = valid.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      progress: 0,
      status: "pending",
    }));
    setFiles(fileStates);
    setPhase("preview");
  }, []);

  const updateFile = (index: number, patch: Partial<FileState>) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const handleUpload = async () => {
    setPhase("uploading");

    const results: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];

      // Compress
      updateFile(i, { status: "compressing", progress: 10 });
      let compressed: File;
      try {
        compressed = await compressImage(f.file);
      } catch {
        updateFile(i, { status: "error", errorMessage: S.errorGeneric });
        continue;
      }

      // Upload
      updateFile(i, { status: "uploading", progress: 30 });
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("uploaderName", uploaderName.trim());

      try {
        const xhr = new XMLHttpRequest();
        const uploadUrl = await new Promise<string>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = 30 + Math.round((e.loaded / e.total) * 65);
              updateFile(i, { progress: pct });
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              resolve(data.url);
            } else {
              reject(new Error(xhr.responseText));
            }
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });

        updateFile(i, { status: "done", progress: 100, uploadedUrl: uploadUrl });
        results.push(uploadUrl);
      } catch {
        updateFile(i, { status: "error", progress: 0, errorMessage: S.errorUpload });
      }
    }

    setPhase("done");
    // Clean up preview URLs
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles((prev) => prev.map((f, i) => ({ ...f, uploadedUrl: results[i] ?? f.uploadedUrl })));
  };

  const handleReset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setPhase("idle");
    setGlobalError("");
    setUploaderName("");
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const successUrls = files.filter((f) => f.uploadedUrl).map((f) => f.uploadedUrl!);

  if (phase === "done") {
    return <SuccessMessage uploadedUrls={successUrls} onUploadMore={handleReset} />;
  }

  const allDone = files.length > 0 && files.every((f) => f.status === "done" || f.status === "error");
  const isUploading = phase === "uploading" && !allDone;

  return (
    <div className="w-full">
      {/* Name input */}
      <div className="mb-5">
        <input
          type="text"
          placeholder={S.namePlaceholder}
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-base text-stone-700 placeholder-stone-300 focus:outline-none focus:border-stone-400 bg-white"
          style={{ fontSize: "16px" }}
        />
      </div>

      {/* Upload buttons */}
      {phase === "idle" && (
        <div className="space-y-3">
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="w-full py-4 bg-stone-800 text-white rounded-2xl text-base font-medium active:bg-stone-900 transition-colors"
          >
            {S.uploadButton}
          </button>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full py-4 border border-stone-300 text-stone-600 rounded-2xl text-base hover:bg-stone-50 transition-colors"
          >
            {S.cameraButton}
          </button>
          <p className="text-center text-xs text-stone-400 mt-2">{S.dropHint}</p>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* Error */}
      {globalError && (
        <p className="text-sm text-red-500 text-center mt-3">{globalError}</p>
      )}

      {/* Preview / progress list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-1 divide-y divide-stone-100">
          {files.map((f, i) => (
            <ProgressBar
              key={i}
              filename={f.file.name}
              progress={f.progress}
              status={f.status}
              errorMessage={f.errorMessage}
              previewUrl={f.previewUrl}
            />
          ))}
        </div>
      )}

      {/* Upload / change buttons */}
      {phase === "preview" && (
        <div className="mt-6 space-y-3">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-4 bg-stone-800 text-white rounded-2xl text-base font-medium disabled:opacity-50 transition-colors"
          >
            {isUploading ? S.uploading : S.uploadPhotos(files.length)}
          </button>
          <button
            onClick={handleReset}
            className="w-full py-3 text-sm text-stone-400 hover:text-stone-600"
          >
            {S.cancelButton}
          </button>
        </div>
      )}

      {phase === "uploading" && !allDone && (
        <p className="text-center text-sm text-stone-400 mt-4">{S.uploading}</p>
      )}
    </div>
  );
}

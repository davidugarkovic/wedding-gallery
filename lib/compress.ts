import { COMPRESS_MAX_WIDTH, COMPRESS_QUALITY, COMPRESS_TARGET_KB } from "./constants";

export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > COMPRESS_MAX_WIDTH) {
        height = Math.round((height * COMPRESS_MAX_WIDTH) / width);
        width = COMPRESS_MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      ctx.drawImage(img, 0, 0, width, height);

      // Try to get under the target size
      let quality = COMPRESS_QUALITY;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));

            if (blob.size > COMPRESS_TARGET_KB * 1024 && quality > 0.4) {
              quality -= 0.1;
              tryCompress();
              return;
            }

            const compressed = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, ".jpg"),
              { type: "image/jpeg" }
            );
            resolve(compressed);
          },
          "image/jpeg",
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

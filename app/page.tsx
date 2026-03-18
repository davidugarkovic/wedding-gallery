import UploadZone from "@/components/UploadZone";
import { WEDDING_NAMES, WEDDING_DATE } from "@/lib/constants";
import { S } from "@/lib/strings";

export default function GuestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-5 py-12">
      {/* Header */}
      <div className="text-center mb-10 max-w-sm">
        <div className="text-3xl mb-5">💍</div>
        <h1
          className="text-4xl font-light tracking-wide mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {WEDDING_NAMES}
        </h1>
        <p className="text-sm text-stone-400 tracking-widest uppercase">
          {WEDDING_DATE}
        </p>
        <div className="w-12 h-px bg-stone-200 mx-auto mt-5 mb-5" />
        <p className="text-stone-600 text-sm leading-relaxed">{S.pageTitle}</p>
        <p className="text-stone-400 text-xs mt-1">{S.pageSubtitle}</p>
      </div>

      {/* Upload zone */}
      <div className="w-full max-w-sm">
        <UploadZone />
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-stone-300 text-center">
        {WEDDING_NAMES}
      </p>
    </main>
  );
}

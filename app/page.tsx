import UploadZone from "@/components/UploadZone";
import { WEDDING_NAMES, WEDDING_DATE } from "@/lib/constants";
import { S } from "@/lib/strings";

export default function GuestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-5 py-12">
      {/* Header */}
      <div className="text-center mb-10 max-w-sm w-full">
        {/* Gold ornament */}
        <div className="text-gold text-lg mb-6 tracking-[0.4em]">✦</div>

        {/* Names */}
        <h1
          className="text-5xl font-light tracking-widest mb-3 text-foreground"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {WEDDING_NAMES}
        </h1>

        {/* Date */}
        <p className="text-xs tracking-[0.2em] uppercase text-gold-dark">
          {WEDDING_DATE}
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 my-6 max-w-[180px] mx-auto">
          <div className="flex-1 h-px bg-gold-light" />
          <span className="text-gold text-[10px]">✦</span>
          <div className="flex-1 h-px bg-gold-light" />
        </div>

        {/* Subtitle */}
        <p className="text-stone-600 text-sm leading-relaxed">{S.pageTitle}</p>
        <p className="text-stone-400 text-xs mt-1">{S.pageSubtitle}</p>
      </div>

      {/* Upload zone — ivory card with gold border */}
      <div className="w-full max-w-sm bg-ivory rounded-2xl border border-gold-light shadow-sm px-6 py-6">
        <UploadZone />
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-gold tracking-widest text-center">
        {WEDDING_NAMES}
      </p>
    </main>
  );
}

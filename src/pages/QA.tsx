import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "@/lib/gsap";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import WorkStrip from "@/components/sections/WorkStrip";
import Archive from "@/components/sections/Archive";
import Designer from "@/components/sections/Designer";
import Atelier from "@/components/sections/Atelier";
import CTABanner from "@/components/sections/CTABanner";
import Footer from "@/components/sections/Footer";
import { Preloader } from "@/components/sections/Preloader";
import { VisualAudit } from "@/components/qa/VisualAudit";

type SectionEntry = {
  id: string;
  label: string;
  notes: string;
  Component: React.ComponentType;
  /** Skip the visual audit for sections that intentionally have no asterisks
   *  or display headings (preloader uses skeletons, marquee is text-only). */
  skipAudit?: boolean;
};

const SECTIONS: SectionEntry[] = [
  { id: "preloader", label: "Preloader", notes: "Skeleton shimmer + upward wipe reveal", Component: Preloader, skipAudit: true },
  { id: "hero", label: "Hero", notes: "GSAP SplitText char reveal, parallax portrait", Component: Hero },
  { id: "marquee", label: "Marquee", notes: "Infinite GSAP loop, rotating asterisks", Component: Marquee },
  { id: "workstrip", label: "Work Strip", notes: "Pinned horizontal scroll, 5 editorial cards", Component: WorkStrip },
  { id: "archive", label: "Archive", notes: "Polaroid tilt cards, scattered asterisks", Component: Archive },
  { id: "designer", label: "Designer", notes: "Portrait + bio reveal", Component: Designer },
  { id: "atelier", label: "Atelier", notes: "Blog polaroids, pill tags, 2-line desc", Component: Atelier },
  { id: "ctabanner", label: "CTA Banner", notes: "Clip-reveal headline, magnetic button", Component: CTABanner },
  { id: "footer", label: "Footer", notes: "Subscribe form (idle/loading/success/error)", Component: Footer },
];

/**
 * Single isolated section frame with optional visual-regression audit.
 * Its own ref lets VisualAudit measure exactly the rendered subtree.
 */
function QASectionFrame({
  entry,
  index,
  showAudit,
  auditNonce,
}: {
  entry: SectionEntry;
  index: number;
  showAudit: boolean;
  auditNonce: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { id, label, notes, Component, skipAudit } = entry;

  return (
    <section id={`qa-${id}`} className="scroll-mt-32">
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="text-lg font-semibold">{label}</h2>
          <span className="text-xs text-muted-foreground">{notes}</span>
        </div>
        <a
          href={`#qa-${id}`}
          className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          #{id}
        </a>
      </div>

      <div
        ref={frameRef}
        data-qa-frame
        className="relative overflow-hidden rounded-lg border border-border bg-background shadow-sm"
      >
        <Component />
      </div>

      {showAudit && !skipAudit && (
        <VisualAudit targetRef={frameRef} sectionId={id} nonce={auditNonce} />
      )}
      {showAudit && skipAudit && (
        <p className="mt-2 px-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Audit skipped — section uses skeletons or is text-only
        </p>
      )}
    </section>
  );
}

export default function QA() {
  const [active, setActive] = useState<string>("all");
  const [outline, setOutline] = useState(false);
  const [showAudit, setShowAudit] = useState(true);
  const [auditNonce, setAuditNonce] = useState(0);

  const visible = useMemo(
    () => (active === "all" ? SECTIONS : SECTIONS.filter((s) => s.id === active)),
    [active]
  );

  // Live ScrollTrigger registry counter — leak watcher
  const [stCount, setStCount] = useState(0);
  useEffect(() => {
    const tick = () => setStCount(ScrollTrigger.getAll().length);
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [active]);

  // Re-run audits whenever section visibility changes (frames remount)
  useEffect(() => {
    setAuditNonce((n) => n + 1);
  }, [active, showAudit]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-[100] border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </Link>
          <span className="mx-2 h-4 w-px bg-border" />
          <h1 className="text-sm font-medium">QA Checklist</h1>
          <span className="text-xs text-muted-foreground">
            {visible.length} section{visible.length === 1 ? "" : "s"}
          </span>
          <span
            title="Live ScrollTrigger count — should stay flat while idle"
            className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            ST: {stCount}
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAuditNonce((n) => n + 1)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:border-foreground"
            >
              Re-audit
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={showAudit}
                onChange={(e) => setShowAudit(e.target.checked)}
                className="h-3 w-3 accent-foreground"
              />
              Audit
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={outline}
                onChange={(e) => setOutline(e.target.checked)}
                className="h-3 w-3 accent-foreground"
              />
              Outline
            </label>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            >
              <option value="all">All sections</option>
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Anchor nav */}
        <nav className="mx-auto flex max-w-screen-2xl flex-wrap gap-1 px-4 pb-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#qa-${s.id}`}
              className="rounded-full border border-border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:border-foreground hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      {outline && (
        <style>{`
          [data-qa-frame] *:not(svg):not(path) {
            outline: 1px dashed hsl(var(--primary) / 0.35);
            outline-offset: -1px;
          }
        `}</style>
      )}

      <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6">
        {visible.map((entry, i) => (
          <QASectionFrame
            key={entry.id}
            entry={entry}
            index={i}
            showAudit={showAudit}
            auditNonce={auditNonce}
          />
        ))}
      </main>

      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        QA mode — preloader/cursor/smooth-scroll behaviors may differ from the live site.
      </footer>
    </div>
  );
}

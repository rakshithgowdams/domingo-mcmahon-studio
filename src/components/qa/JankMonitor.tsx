import { useEffect, useRef, useState } from "react";

/**
 * JankMonitor — quick visual QA for scroll-time frame drops.
 *
 * Activation:
 *   - Add `?jank=1` to the URL, OR press the "J" key once on the page.
 *
 * What it does:
 *   1. Tags every <section> on the page with a `data-jank-name` derived
 *      from the nearest section component (uses the section's first
 *      heading, aria-label, or class hint as a friendly label).
 *   2. Watches requestAnimationFrame intervals while the user scrolls.
 *   3. Any frame longer than `THRESHOLD_MS` (default 32ms ≈ <30fps) is
 *      counted as a "jank frame" against whichever section currently
 *      sits under the viewport center.
 *   4. Sections that accumulate >= REPORT_AT jank frames get:
 *        - A hot-pink dashed outline + corner badge on the page itself.
 *        - A `console.warn("[Jank] <section> — N stutters in Xms windows")`
 *          (named so you can ctrl-F the offender in the section list).
 *   5. A small toolbar in the bottom-left shows live counts and a Reset.
 *
 * Zero impact when not active (the rAF loop only starts after activation).
 */

const THRESHOLD_MS = 32; // anything slower than this = jank frame
const REPORT_AT = 3; // start outlining after this many jank frames per section
const SAMPLE_WINDOW_MS = 4000; // rolling window for "recent" stutters

type Counts = Record<string, { total: number; recent: number[] }>;

function inferSectionName(section: HTMLElement, fallbackIdx: number): string {
  // Priority: aria-label > first heading text > className hint > index.
  const aria = section.getAttribute("aria-label");
  if (aria) return aria;
  const heading = section.querySelector("h1, h2, h3");
  const text = heading?.textContent?.trim();
  if (text) return text.slice(0, 48);
  const cls = section.className.split(/\s+/).find((c) => c.length > 4);
  if (cls) return cls;
  return `section-${fallbackIdx}`;
}

export const JankMonitor = () => {
  const [active, setActive] = useState(false);
  const [counts, setCounts] = useState<Counts>({});
  const countsRef = useRef<Counts>({});

  // Activation gate: ?jank=1 OR press "j"
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("jank") === "1") {
      setActive(true);
    }
    const onKey = (e: KeyboardEvent) => {
      // Ignore keystrokes inside form fields.
      const target = e.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable='true']")) return;
      if (e.key === "j" || e.key === "J") setActive((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Main monitor loop — runs only while active.
  useEffect(() => {
    if (!active) return;

    // 1) Tag every section with a friendly name.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));
    sections.forEach((s, i) => {
      if (!s.dataset.jankName) {
        s.dataset.jankName = inferSectionName(s, i);
      }
    });

    countsRef.current = {};
    setCounts({});

    let raf = 0;
    let lastTs = performance.now();
    let scrolling = false;
    let scrollTimeout: number | null = null;

    const onScroll = () => {
      scrolling = true;
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      // After 250ms of no scroll events, stop attributing janks (avoids
      // false-positives from idle GC pauses).
      scrollTimeout = window.setTimeout(() => {
        scrolling = false;
      }, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Lenis emits its own scroll on window via its internal listeners,
    // so the standard listener above is sufficient.

    const tick = (ts: number) => {
      const delta = ts - lastTs;
      lastTs = ts;

      if (scrolling && delta > THRESHOLD_MS) {
        // Find which section is under the viewport center right now.
        const cy = window.innerHeight / 2;
        let hit: HTMLElement | null = null;
        for (const s of sections) {
          const r = s.getBoundingClientRect();
          if (r.top <= cy && r.bottom >= cy) {
            hit = s;
            break;
          }
        }
        if (hit) {
          const name = hit.dataset.jankName || "unknown";
          const entry =
            countsRef.current[name] || (countsRef.current[name] = { total: 0, recent: [] });
          entry.total += 1;
          entry.recent.push(ts);
          // Trim window
          const cutoff = ts - SAMPLE_WINDOW_MS;
          while (entry.recent.length && entry.recent[0] < cutoff) entry.recent.shift();

          // Mark the section visually + log when threshold crossed.
          if (entry.total === REPORT_AT) {
            hit.dataset.jankFlagged = "1";
            // eslint-disable-next-line no-console
            console.warn(
              `[Jank] "${name}" — ${entry.total} stutters detected during scroll ` +
                `(${Math.round(delta)}ms frame, threshold ${THRESHOLD_MS}ms).`
            );
          } else if (entry.total > REPORT_AT && entry.total % 5 === 0) {
            // eslint-disable-next-line no-console
            console.warn(
              `[Jank] "${name}" — ${entry.total} cumulative stutters; ` +
                `${entry.recent.length} in the last ${SAMPLE_WINDOW_MS / 1000}s.`
            );
          }

          // Throttle React state updates to ~4Hz so the panel itself
          // doesn't become a source of jank.
          if (ts - (tick as any)._lastSet > 250) {
            (tick as any)._lastSet = ts;
            setCounts({ ...countsRef.current });
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    (tick as any)._lastSet = 0;
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      // Clear visual flags so toggling off restores a clean view.
      sections.forEach((s) => {
        delete s.dataset.jankFlagged;
      });
    };
  }, [active]);

  if (!active) return null;

  const entries = Object.entries(counts).sort((a, b) => b[1].total - a[1].total);

  return (
    <>
      {/* Inline stylesheet — keeps this component fully self-contained. */}
      <style>{`
        section[data-jank-flagged="1"] {
          outline: 2px dashed hsl(335 100% 62%);
          outline-offset: -2px;
          position: relative;
        }
        section[data-jank-flagged="1"]::before {
          content: "JANK: " attr(data-jank-name);
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 9997;
          padding: 4px 8px;
          font: 600 10px/1 ui-monospace, monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: hsl(335 100% 62%);
          border-radius: 3px;
          pointer-events: none;
        }
      `}</style>
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-4 z-[9997] max-w-[280px] rounded-md border border-foreground/20 bg-background/95 p-3 font-mono text-[11px] leading-tight text-foreground shadow-lg backdrop-blur-sm"
      >
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="font-semibold uppercase tracking-wider">Jank Monitor</span>
          <button
            type="button"
            onClick={() => {
              countsRef.current = {};
              setCounts({});
              document
                .querySelectorAll<HTMLElement>("section[data-jank-flagged]")
                .forEach((s) => delete s.dataset.jankFlagged);
            }}
            className="rounded border border-foreground/30 px-1.5 py-0.5 text-[9px] uppercase hover:bg-foreground hover:text-background"
          >
            Reset
          </button>
        </div>
        <div className="mb-1.5 text-[9px] text-foreground/60">
          Threshold: >{THRESHOLD_MS}ms · Scroll the page · Press J to toggle
        </div>
        {entries.length === 0 ? (
          <div className="text-foreground/50">No janks detected yet ✓</div>
        ) : (
          <ul className="space-y-0.5">
            {entries.slice(0, 8).map(([name, data]) => (
              <li
                key={name}
                className={
                  data.total >= REPORT_AT
                    ? "flex justify-between gap-2 text-[hsl(335_100%_45%)]"
                    : "flex justify-between gap-2"
                }
              >
                <span className="truncate" title={name}>
                  {name}
                </span>
                <span className="shrink-0 tabular-nums">
                  {data.total} ({data.recent.length} recent)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default JankMonitor;

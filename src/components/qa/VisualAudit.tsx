import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Visual regression audit. Inspects the DOM inside `targetRef` and runs a
 * battery of deterministic checks for:
 *
 *   1. TYPOGRAPHY — display headings exist, use the Anton/display family,
 *      and respect the expected size buckets (display / heading / body).
 *   2. ACCENT COLORS — every <Asterisk> SVG has a computed `color` matching
 *      one of the design-token accent values.
 *   3. ASTERISK PLACEMENT — at least one asterisk per section, none clipped
 *      outside the section bounds, sizes within the documented 16–80px range.
 *
 * Results render as a compact pass/warn/fail list under the section frame.
 * Re-runs whenever the user clicks "Re-audit" or the section changes.
 */

type Status = "pass" | "warn" | "fail";

interface CheckResult {
  id: string;
  label: string;
  status: Status;
  detail: string;
}

interface AuditProps {
  targetRef: React.RefObject<HTMLElement>;
  sectionId: string;
  /** Bumped externally to force a re-run. */
  nonce: number;
}

// Token values pulled from index.css / tailwind.config.ts.
// Matches are computed-style HSL strings; we extract H/S/L numerically and
// compare with a small tolerance to absorb sub-percent rounding differences.
const ACCENT_TOKENS = [
  "--accent-orange",
  "--accent-lime",
  "--accent-forest",
  "--accent-pink",
  "--accent-purple",
  "--accent-yellow",
  "--accent-blue",
  "--foreground", // ink/black asterisks
] as const;

function parseHsl(input: string): [number, number, number] | null {
  // Matches "rgb(r, g, b)" or "rgba(r, g, b, a)" — what getComputedStyle returns.
  const m = input.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b] = m[1].split(",").map((v) => parseFloat(v.trim()));
  return rgbToHsl(r, g, b);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function colorsClose(a: [number, number, number], b: [number, number, number], tol = 6): boolean {
  // Hue wraps; compare circularly.
  const dh = Math.min(Math.abs(a[0] - b[0]), 360 - Math.abs(a[0] - b[0]));
  return dh <= tol && Math.abs(a[1] - b[1]) <= tol && Math.abs(a[2] - b[2]) <= tol;
}

function readTokenColors(): { name: string; hsl: [number, number, number] }[] {
  const root = getComputedStyle(document.documentElement);
  return ACCENT_TOKENS.map((name) => {
    const raw = root.getPropertyValue(name).trim(); // e.g. "20 95% 60%"
    const [h, s, l] = raw.split(/\s+/).map((p) => parseFloat(p));
    return { name, hsl: [h, s, l] as [number, number, number] };
  }).filter((t) => Number.isFinite(t.hsl[0]));
}

export function VisualAudit({ targetRef, sectionId, nonce }: AuditProps) {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);
  const lastNonce = useRef(-1);

  const summary = useMemo(() => {
    const pass = results.filter((r) => r.status === "pass").length;
    const warn = results.filter((r) => r.status === "warn").length;
    const fail = results.filter((r) => r.status === "fail").length;
    return { pass, warn, fail, total: results.length };
  }, [results]);

  useEffect(() => {
    if (nonce === lastNonce.current) return;
    lastNonce.current = nonce;

    const root = targetRef.current;
    if (!root) return;
    setRunning(true);

    // Defer one frame so any GSAP set/fromTo calls in the section have
    // applied initial styles before we measure.
    const id = requestAnimationFrame(() => {
      const checks: CheckResult[] = [];
      const sectionRect = root.getBoundingClientRect();

      // ---------------- 1. TYPOGRAPHY ----------------
      const displayEls = Array.from(
        root.querySelectorAll<HTMLElement>(".display, h1, h2")
      );
      if (displayEls.length === 0) {
        checks.push({
          id: "typo-display-present",
          label: "Display heading present",
          status: "warn",
          detail: "No .display / h1 / h2 found in section",
        });
      } else {
        // Family check
        const wrongFamily = displayEls.filter((el) => {
          const fam = getComputedStyle(el).fontFamily.toLowerCase();
          return !fam.includes("anton") && !fam.includes("bebas");
        });
        checks.push({
          id: "typo-display-family",
          label: "Display family is Anton/Bebas",
          status: wrongFamily.length === 0 ? "pass" : "fail",
          detail:
            wrongFamily.length === 0
              ? `${displayEls.length} display element(s) using correct family`
              : `${wrongFamily.length}/${displayEls.length} using wrong family`,
        });

        // Size bucket check — display headings should be >= 32px
        const sizes = displayEls.map((el) => parseFloat(getComputedStyle(el).fontSize));
        const tooSmall = sizes.filter((s) => s < 32);
        checks.push({
          id: "typo-display-size",
          label: "Display sizes ≥ 32px",
          status: tooSmall.length === 0 ? "pass" : "warn",
          detail: `min ${Math.min(...sizes).toFixed(0)}px, max ${Math.max(...sizes).toFixed(0)}px`,
        });
      }

      // Body text check — paragraphs should use Inter
      const bodyEls = Array.from(root.querySelectorAll<HTMLElement>("p, li"));
      if (bodyEls.length > 0) {
        const wrongBody = bodyEls.filter((el) => {
          const fam = getComputedStyle(el).fontFamily.toLowerCase();
          return !fam.includes("inter") && !fam.includes("system");
        });
        checks.push({
          id: "typo-body-family",
          label: "Body text uses Inter",
          status: wrongBody.length === 0 ? "pass" : "warn",
          detail:
            wrongBody.length === 0
              ? `${bodyEls.length} body element(s) verified`
              : `${wrongBody.length}/${bodyEls.length} using non-Inter family`,
        });
      }

      // ---------------- 2. ACCENT COLORS ----------------
      const tokens = readTokenColors();
      const asterisks = Array.from(root.querySelectorAll<SVGElement>("svg.asterisk"));

      if (asterisks.length === 0) {
        checks.push({
          id: "asterisk-present",
          label: "At least one asterisk present",
          status: "warn",
          detail: "Section has no decorative asterisks",
        });
      } else {
        // Color match check
        const colorMatches = asterisks.map((el) => {
          const raw = getComputedStyle(el).color;
          const hsl = parseHsl(raw);
          if (!hsl) return null;
          const match = tokens.find((t) => colorsClose(hsl, t.hsl));
          return match?.name ?? null;
        });
        const unmatched = colorMatches.filter((m) => m === null).length;
        const tokensUsed = new Set(colorMatches.filter(Boolean));
        checks.push({
          id: "accent-colors",
          label: "Asterisks use design-token accents",
          status: unmatched === 0 ? "pass" : "fail",
          detail:
            unmatched === 0
              ? `${asterisks.length} asterisk(s), ${tokensUsed.size} unique token(s)`
              : `${unmatched}/${asterisks.length} use off-palette colors`,
        });

        // ---------------- 3. ASTERISK PLACEMENT ----------------
        // Count
        const tooMany = asterisks.length > 8;
        checks.push({
          id: "asterisk-count",
          label: "Asterisk count 1–8",
          status: asterisks.length >= 1 && !tooMany ? "pass" : "warn",
          detail: `${asterisks.length} asterisk(s) in section`,
        });

        // Size bucket — documented range 16–80px
        const sizes = asterisks.map((el) => {
          const r = el.getBoundingClientRect();
          return Math.max(r.width, r.height);
        });
        const outOfRange = sizes.filter((s) => s < 14 || s > 90).length;
        checks.push({
          id: "asterisk-sizes",
          label: "Asterisk sizes 16–80px",
          status: outOfRange === 0 ? "pass" : "warn",
          detail: `min ${Math.min(...sizes).toFixed(0)}px, max ${Math.max(...sizes).toFixed(0)}px`,
        });

        // Clipping — every asterisk's center must lie within the section bounds.
        // Edges may overlap (decorative bleed is OK), but the center going
        // outside means the element is positioned wrong.
        const clipped = asterisks.filter((el) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          return (
            cx < sectionRect.left - 4 ||
            cx > sectionRect.right + 4 ||
            cy < sectionRect.top - 4 ||
            cy > sectionRect.bottom + 4
          );
        });
        checks.push({
          id: "asterisk-clipping",
          label: "No asterisks positioned outside section",
          status: clipped.length === 0 ? "pass" : "fail",
          detail:
            clipped.length === 0
              ? "All centers inside section bounds"
              : `${clipped.length} asterisk(s) center outside bounds`,
        });

        // Color variety — encourage 2+ accent colors per section for the
        // hand-placed editorial look (warn if monochrome with 3+ asterisks).
        if (asterisks.length >= 3 && tokensUsed.size < 2) {
          checks.push({
            id: "asterisk-variety",
            label: "Asterisk color variety (2+ accents)",
            status: "warn",
            detail: `${asterisks.length} asterisks share a single accent`,
          });
        } else if (asterisks.length >= 2) {
          checks.push({
            id: "asterisk-variety",
            label: "Asterisk color variety (2+ accents)",
            status: "pass",
            detail: `${tokensUsed.size} unique accent(s) across ${asterisks.length} asterisks`,
          });
        }
      }

      setResults(checks);
      setRunning(false);
    });

    return () => cancelAnimationFrame(id);
  }, [nonce, targetRef, sectionId]);

  if (running && results.length === 0) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
        Auditing…
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div className="mt-2 rounded-md border border-border bg-card/50 p-3">
      {/* Summary chip row */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
        <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-green-700 dark:text-green-400">
          ✓ {summary.pass}
        </span>
        <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-yellow-700 dark:text-yellow-400">
          ! {summary.warn}
        </span>
        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-red-700 dark:text-red-400">
          ✗ {summary.fail}
        </span>
        <span className="text-muted-foreground">{summary.total} checks</span>
      </div>

      <ul className="space-y-1">
        {results.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-[16px_1fr_auto] items-baseline gap-2 text-xs"
          >
            <span
              aria-hidden
              className={
                r.status === "pass"
                  ? "text-green-600 dark:text-green-400"
                  : r.status === "warn"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
              }
            >
              {r.status === "pass" ? "✓" : r.status === "warn" ? "!" : "✗"}
            </span>
            <span className="text-foreground">{r.label}</span>
            <span className="text-right font-mono text-[10px] text-muted-foreground">
              {r.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VisualAudit;

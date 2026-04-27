import { useState, useRef, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SplitType from "split-type";
import { BrandStar } from "@/components/ui/BrandStar";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email")
  .max(255, "Email is too long")
  .email("Please enter a valid email");

async function submitSubscription(email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 900));
  if (Math.random() < 0.1) throw new Error("Network error");
  const stored = JSON.parse(localStorage.getItem("dm_subscribers") ?? "[]") as string[];
  if (stored.includes(email.toLowerCase())) {
    throw new Error("You're already subscribed.");
  }
  localStorage.setItem("dm_subscribers", JSON.stringify([...stored, email.toLowerCase()]));
}

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // SILHOUETTE — bounce-in character drop from above
  useGSAP(() => {
    if (!headlineRef.current) return;
    const split = new SplitType(headlineRef.current, { types: "chars" });
    if (!split.chars) return;
    gsap.set(split.chars, { y: -150, opacity: 0 });
    gsap.to(split.chars, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.05,
      ease: "bounce.out",
      scrollTrigger: { trigger: headlineRef.current, start: "top 85%" },
    });
    return () => split.revert();
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0].message);
      return;
    }
    setStatus("loading");
    try {
      await submitSubscription(parsed.data);
      setStatus("success");
      setMessage("You're on the list. Welcome to the archive.");
      setEmail("");
      toast.success("Subscribed", { description: "You'll hear from the studio soon." });
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessage(msg);
      toast.error("Subscription failed", { description: msg });
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <footer className="grid grid-cols-1 lg:grid-cols-10">
      {/* Left black column */}
      <div className="relative bg-foreground px-6 py-10 text-white md:px-10 lg:col-span-3 lg:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">Follow Me On</p>
        <ul className="mt-4 space-y-1 text-base">
          {["Facebook", "Instagram", "Tik tok"].map((s) => (
            <li key={s}>
              <a href="#" className="story-link transition-opacity hover:opacity-70">{s}</a>
            </li>
          ))}
        </ul>
        {/* Star N — orange, in the black left column */}
        <BrandStar
          color="orange"
          size={80}
          initialRotation={0}
          className="absolute z-10"
          style={{ top: "18%", left: "18%" }}
        />

        <div className="mt-12">
          <p className="display text-3xl text-white md:text-4xl">Be Part of<br />The Story</p>
          <p className="mt-3 text-xs text-white/70">Updates on new drops, collaborations, and events.</p>
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isLoading}
            className={`mt-4 flex overflow-hidden rounded-full bg-white p-1 ring-1 transition-colors ${
              isError ? "ring-accent-pink" : isSuccess ? "ring-accent-lime" : "ring-transparent"
            }`}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              disabled={isLoading}
              aria-invalid={isError}
              aria-describedby="subscribe-feedback"
              placeholder="Email address"
              className="flex-1 bg-transparent px-4 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isLoading ? "Sending…" : isSuccess ? "Subscribed ✓" : "Subscribe"}
            </button>
          </form>
          <p
            id="subscribe-feedback"
            role="status"
            aria-live="polite"
            className={`mt-2 min-h-[1.25rem] text-[11px] leading-snug ${
              isError ? "text-accent-pink" : isSuccess ? "text-accent-lime" : "text-white/60"
            }`}
          >
            {message}
          </p>
        </div>

        <p className="mt-16 text-[11px] uppercase tracking-[0.25em] text-white/60">Let's Stay Connected</p>
      </div>

      {/* Right white column */}
      <div className="relative flex flex-col justify-between bg-background px-6 py-10 md:px-10 lg:col-span-7 lg:py-12">
        {/* Stage 2F: removed loose pink/orange decoratives — covered by placed Stars N/O */}

        <div className="relative">
          {/* Star O — blue, overlapping the S of SILHOUETTE */}
          <BrandStar
            color="blue"
            size={65}
            initialRotation={15}
            className="absolute z-10"
            style={{ bottom: "22%", left: "8%" }}
          />
          <h2
            ref={headlineRef}
            className="display text-accent-forest"
            style={{ fontSize: "clamp(96px, 22vw, 360px)", lineHeight: "0.82", letterSpacing: "-0.05em" }}
          >
            Silhouette
          </h2>
        </div>

        <div className="mt-10">
          <div className="h-px w-full bg-foreground" />
          <div className="flex flex-col items-start justify-between gap-3 pt-4 text-[11px] uppercase tracking-wider text-foreground sm:flex-row sm:items-center">
            <p>© 2026 Developed by @aiwithrakshith. All rights reserved.</p>
            <a href="#" className="story-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

/**
 * Procedural electrical arc field, drawn on canvas.
 *
 * No video, no image assets — the hero is generated at runtime, so it costs
 * nothing to ship, never pixelates, and re-colors from CSS variables if the
 * brand changes.
 *
 * `intensityRef` is a 0–1 scroll signal owned by the parent. It is read (not
 * subscribed to) inside the animation loop so scrolling never triggers a
 * React render.
 */
export function ArcField({
  intensityRef,
  className = "",
}: {
  intensityRef: React.RefObject<number>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /**
     * Midpoint displacement with *proportional* offset: each subdivision
     * displaces by a fraction of that segment's own length, which is what
     * makes lightning self-similar. A fixed decaying offset (the naive
     * version) flattens into a mountain ridge instead.
     */
    const bolt = (a: Point, b: Point, jag = 0.42): Point[] => {
      let pts: Point[] = [a, b];
      for (let pass = 0; pass < 8; pass++) {
        const next: Point[] = [];
        let subdivided = false;
        for (let i = 0; i < pts.length - 1; i++) {
          const p = pts[i];
          const q = pts[i + 1];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const len = Math.hypot(dx, dy);
          next.push(p);
          if (len < 6) continue;
          subdivided = true;
          const d = (Math.random() - 0.5) * len * jag;
          next.push({
            x: (p.x + q.x) / 2 - (dy / len) * d,
            y: (p.y + q.y) / 2 + (dx / len) * d,
          });
        }
        next.push(pts[pts.length - 1]);
        pts = next;
        if (!subdivided) break;
      }
      return pts;
    };

    type Arc = { pts: Point[]; life: number; max: number; branches: Point[][] };
    const arcs: Arc[] = [];

    const MAX_ARCS = 4;

    const spawnArc = () => {
      if (arcs.length >= MAX_ARCS) return;

      // Strikes descend diagonally, the way a discharge actually falls,
      // rather than running edge-to-edge along the horizon.
      const a = {
        x: width * (0.1 + Math.random() * 0.8),
        y: -height * 0.05,
      };
      const b = {
        x: a.x + (Math.random() - 0.5) * width * 0.55,
        y: height * (0.55 + Math.random() * 0.5),
      };
      const pts = bolt(a, b);

      // Forks branch off and die out partway, like the real thing.
      const branches: Point[][] = [];
      const forks = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < forks; i++) {
        const idx = Math.floor(pts.length * (0.15 + Math.random() * 0.7));
        const from = pts[idx];
        const reach = 0.12 + Math.random() * 0.22;
        branches.push(
          bolt(from, {
            x: from.x + (Math.random() - 0.5) * width * reach * 1.6,
            y: from.y + height * reach,
          }),
        );
      }

      const max = 34 + Math.random() * 26;
      arcs.push({ pts, life: max, max, branches });
    };

    type Spark = { x: number; y: number; vx: number; vy: number; life: number };
    const sparks: Spark[] = [];

    const spawnSparks = (p: Point, n: number) => {
      for (let i = 0; i < n; i++) {
        sparks.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -Math.random() * 1.2 - 0.2,
          life: 40 + Math.random() * 50,
        });
      }
    };

    const strokePath = (
      pts: Point[],
      color: string,
      lineWidth: number,
      alpha: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = alpha;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    };

    /**
     * Fake bloom: the same path drawn repeatedly, widening and dimming, with
     * additive compositing so overlapping strokes build light the way a real
     * exposure does.
     */
    const drawGlowing = (pts: Point[], strength: number) => {
      ctx.globalCompositeOperation = "lighter";
      strokePath(pts, "#f5a524", 22, 0.05 * strength);
      strokePath(pts, "#f5a524", 11, 0.09 * strength);
      strokePath(pts, "#ffb648", 5, 0.22 * strength);
      strokePath(pts, "#ffd489", 2.2, 0.5 * strength);
      strokePath(pts, "#ffffff", 1, 0.95 * strength);
      ctx.globalCompositeOperation = "source-over";
    };

    /** Sparks burst from where the strike lands. */
    const pts_end = (pts: Point[]) => pts.length - 1;

    let frame = 0;
    let raf = 0;

    const draw = () => {
      frame++;
      const intensity = Math.max(0, Math.min(1, intensityRef.current ?? 0));

      ctx.clearRect(0, 0, width, height);

      // Standing field: slow vertical filaments that drift and pulse, so the
      // stage is never an empty black rectangle between strikes.
      ctx.globalCompositeOperation = "lighter";
      for (let f = 0; f < 7; f++) {
        const seed = f * 1.7;
        const x = width * ((f + 0.5) / 7) + Math.sin(frame * 0.003 + seed) * width * 0.04;
        const pts: Point[] = [];
        for (let y = 0; y <= height; y += 18) {
          pts.push({
            x:
              x +
              Math.sin(y * 0.006 + frame * 0.006 + seed) * 22 +
              Math.sin(y * 0.017 + frame * 0.011 + seed) * 7,
            y,
          });
        }
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.02 + seed * 2);
        strokePath(pts, "#f5a524", 1.2, (0.13 + pulse * 0.12) * (0.7 + intensity * 0.6));
      }
      ctx.globalCompositeOperation = "source-over";

      // Arc spawning scales with scroll depth.
      const rate = reduceMotion ? 0.008 : 0.055 + intensity * 0.1;
      if (Math.random() < rate) spawnArc();

      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.life--;
        if (arc.life <= 0) {
          arcs.splice(i, 1);
          continue;
        }
        // Envelope: a hard flash for the first few frames, then a dim
        // afterglow that lingers so the stage is never empty between strikes.
        const age = arc.max - arc.life;
        const flash = Math.max(0, 1 - age / 5);
        const afterglow = (arc.life / arc.max) * 0.3;
        const flicker = 0.7 + Math.random() * 0.3;
        const strength =
          (flash * flicker + afterglow) * (0.8 + intensity * 0.5);

        drawGlowing(arc.pts, strength);
        for (const b of arc.branches) drawGlowing(b, strength * 0.45);

        if (age === 1 && !reduceMotion) {
          spawnSparks(arc.pts[pts_end(arc.pts)], 10);
        }
      }

      // Sparks drift up and fade.
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life--;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.012;
        ctx.globalAlpha = Math.min(1, s.life / 40) * 0.8;
        ctx.fillStyle = "#ffd489";
        ctx.fillRect(s.x, s.y, 1.6, 1.6);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [intensityRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}

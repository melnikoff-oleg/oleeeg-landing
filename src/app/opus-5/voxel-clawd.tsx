"use client";

// The hero toy: a draggable voxel character built out of plain DOM + CSS 3D
// transforms (no three.js, no animation runtime). Ported from the source
// artifact. It builds its cubes imperatively in an effect because every face is
// an absolutely positioned div whose colour is repainted each frame from the
// current Y rotation.
//
// Three things the port adds on top of the original:
//  - it stops the rAF loop whenever the toy is off-screen or the tab is hidden,
//  - it honours prefers-reduced-motion (no idle auto-spin; still draggable),
//  - it scales the rig to the container so it can never poke past the viewport
//    on a 390px phone (the site's no-horizontal-overflow rule).

import { useEffect, useRef } from "react";

/** [x, y, z, width, height, depth, shade] of every cube in the body. */
const PARTS: readonly (readonly number[])[] = [
  [0, 0, 0, 150, 86, 78, 0], // torso
  [-96, -6, 0, 42, 34, 34, -6], // arms
  [96, -6, 0, 42, 34, 34, -6],
  [-75, 16, 0, 40, 16, 16, -3], // hands
  [75, 16, 0, 40, 16, 16, -3],
  [-52, 66, 22, 18, 46, 18, -10], // legs
  [-18, 66, 22, 18, 46, 18, -10],
  [18, 66, 22, 18, 46, 18, -10],
  [52, 66, 22, 18, 46, 18, -10],
  [-46, -58, 0, 20, 30, 20, -4], // antennae
  [46, -58, 0, 20, 30, 20, -4],
];

const EYES: readonly (readonly [number, number])[] = [
  [-33, -14],
  [33, -14],
];

/** Rig width in px at scale 1, used to fit the toy inside its container. */
const RIG_WIDTH = 300;

export function VoxelClawd() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rig = document.createElement("div");
    rig.style.cssText =
      "transform-style:preserve-3d;position:relative;width:0;height:0";
    scene.appendChild(rig);

    const faces: HTMLDivElement[] = [];

    const cube = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      shade: number,
    ) => {
      const vox = document.createElement("div");
      vox.style.cssText = `position:absolute;transform-style:preserve-3d;width:${w}px;height:${h}px`;
      vox.style.transform = `translate3d(${x - w / 2}px,${y - h / 2}px,${z}px)`;

      // [transform, width, height, shade offset] for the six faces.
      const spec: [string, number, number, number][] = [
        [`translateZ(${d / 2}px)`, w, h, 0],
        [`translateZ(${-d / 2}px) rotateY(180deg)`, w, h, -26],
        [`translateX(${-w / 2}px) rotateY(-90deg)`, d, h, -14],
        [`translateX(${w / 2}px) rotateY(90deg)`, d, h, -14],
        [`translateY(${-h / 2}px) rotateX(90deg)`, w, d, 14],
        [`translateY(${h / 2}px) rotateX(-90deg)`, w, d, -30],
      ];

      for (const [transform, fw, fh, offset] of spec) {
        const face = document.createElement("div");
        face.style.cssText =
          "position:absolute;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)";
        face.style.width = `${fw}px`;
        face.style.height = `${fh}px`;
        face.style.left = `${w / 2}px`;
        face.style.top = `${h / 2}px`;
        face.style.transform = `translate(-50%,-50%) ${transform}`;
        face.dataset.shade = String(shade + offset);
        vox.appendChild(face);
        faces.push(face);
      }

      rig.appendChild(vox);
    };

    for (const p of PARTS) cube(p[0], p[1], p[2], p[3], p[4], p[5], p[6]);

    for (const [ex, ey] of EYES) {
      const vox = document.createElement("div");
      vox.style.cssText = "position:absolute;transform-style:preserve-3d";
      vox.style.transform = `translate3d(${ex - 13}px,${ey - 13}px,40px)`;
      const ball = document.createElement("div");
      ball.style.cssText =
        "position:absolute;width:26px;height:26px;border-radius:50%;background:#140f0b;box-shadow:0 0 0 3px rgba(255,255,255,.85)";
      const glint = document.createElement("div");
      glint.style.cssText =
        "position:absolute;left:6px;top:4px;width:8px;height:8px;border-radius:50%;background:#fff;opacity:.9";
      ball.appendChild(glint);
      vox.appendChild(ball);
      rig.appendChild(vox);
    }

    let rx = -14;
    let ry = -26;
    let vx = 0;
    let vy = 0;
    let idle = 0;
    let dragging = false;
    let px = 0;
    let py = 0;
    let scale = 1;

    const fit = () => {
      scale = Math.min(1, (scene.clientWidth || RIG_WIDTH) / RIG_WIDTH);
    };
    fit();

    const paint = () => {
      const hue = ((((ry % 360) + 360) % 360) * 0.75 + 18) % 360;
      for (const face of faces) {
        const shade = Number(face.dataset.shade);
        const light = Math.max(18, Math.min(82, 58 + shade * 0.55));
        const sat = Math.max(35, Math.min(95, 78 + shade * 0.15));
        face.style.background = `hsl(${hue} ${sat}% ${light}%)`;
      }
    };

    const apply = () => {
      rig.style.transform = `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg)`;
      paint();
    };

    let raf = 0;
    const frame = () => {
      if (!dragging) {
        idle++;
        // Drift back into a slow idle spin once the visitor lets go.
        if (idle > 90) vy += (0.34 - vy) * 0.02;
        rx += vx;
        ry += vy;
        vx *= 0.94;
        vy *= 0.985;
        rx += (-14 - rx) * 0.008;
        rx = Math.max(-72, Math.min(72, rx));
      }
      apply();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    apply();

    // Only spin while the toy is actually on screen and the tab is visible.
    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              onScreen = entries.some((e) => e.isIntersecting);
              sync();
            },
            { threshold: 0 },
          )
        : null;
    io?.observe(scene);
    if (!io) start();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            fit();
            apply();
          })
        : null;
    ro?.observe(scene);

    document.addEventListener("visibilitychange", sync);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      idle = 0;
      px = e.clientX;
      py = e.clientY;
      try {
        scene.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      ry += dx * 0.55;
      rx = Math.max(-72, Math.min(72, rx - dy * 0.45));
      vy = dx * 0.55;
      vx = -dy * 0.45;
      apply();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      idle = 0;
      try {
        scene.releasePointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
    };
    // Pointer capture is best-effort, so a release can happen without a
    // pointerup ever reaching the scene. Without these two fallbacks `dragging`
    // could stay true forever: the toy would freeze mid-spin and then follow
    // the cursor with no button held.
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      idle = 0;
    };

    scene.addEventListener("pointerdown", onDown);
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerup", onUp);
    scene.addEventListener("pointercancel", onUp);
    scene.addEventListener("lostpointercapture", endDrag);
    window.addEventListener("pointerup", endDrag);

    return () => {
      stop();
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      scene.removeEventListener("pointerdown", onDown);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerup", onUp);
      scene.removeEventListener("pointercancel", onUp);
      scene.removeEventListener("lostpointercapture", endDrag);
      window.removeEventListener("pointerup", endDrag);
      rig.remove();
    };
  }, []);

  return (
    <div className="flex select-none flex-col items-center gap-3">
      <div
        ref={sceneRef}
        data-testid="voxel-scene"
        role="img"
        aria-label="A rotatable 3D blocky character. Drag it sideways to spin it and it shifts colour as it turns."
        // pan-y (not none) so a vertical swipe still scrolls the page on a phone
        // while a sideways drag spins the toy.
        className="grid aspect-square w-full max-w-[260px] cursor-grab touch-pan-y place-items-center [perspective:900px] active:cursor-grabbing sm:max-w-[300px]"
      />
      <p className="eyebrow font-body text-[13px] text-silver-muted">
        drag to spin &middot;{" "}
        <span className="text-amber-400">built by opus 5</span>
      </p>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on non-touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    gsap.set([cursor, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
        isVisible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
      isVisible = false;
    };

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], .hover-target");
      if (interactive) {
        gsap.to(cursor, {
          scale: 1.8,
          borderColor: "#111111",
          borderWidth: "1.5px",
          backgroundColor: "rgba(17, 17, 17, 0.04)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      } else {
        gsap.to(cursor, {
          scale: 1,
          borderColor: "rgba(17, 17, 17, 0.45)",
          borderWidth: "1px",
          backgroundColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Outer Ring Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-black/40 pointer-events-none z-[100] transition-colors"
      />
      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-black/80 pointer-events-none z-[100]"
      />
    </>
  );
}

"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface WireframeGlobeProps {
  size?: number;
  isHovered?: boolean;
}

export default function WireframeGlobe({ size = 32, isHovered = false }: WireframeGlobeProps) {
  const globeRef = useRef<SVGSVGElement>(null);
  const ring1Ref = useRef<SVGEllipseElement>(null);
  const ring2Ref = useRef<SVGEllipseElement>(null);
  const ring3Ref = useRef<SVGEllipseElement>(null);

  useGSAP(
    () => {
      if (!globeRef.current) return;

      // Continuous gentle rotation of inner meridians
      const tl = gsap.timeline({ repeat: -1 });

      if (ring1Ref.current && ring2Ref.current) {
        tl.to([ring1Ref.current, ring2Ref.current], {
          rotationY: 360,
          transformOrigin: "center center",
          duration: isHovered ? 4 : 9,
          ease: "none",
        });
      }
    },
    { dependencies: [isHovered], scope: globeRef }
  );

  return (
    <svg
      ref={globeRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block transition-transform duration-500 ease-out align-middle"
      style={{
        transform: isHovered ? "scale(1.15) rotate(15deg)" : "scale(1) rotate(0deg)",
      }}
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="currentColor"
        strokeWidth="3.2"
        className="opacity-90"
      />

      {/* Equator / Horizontal Parallel */}
      <line
        x1="6"
        y1="50"
        x2="94"
        y2="50"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeDasharray="1 0"
        className="opacity-80"
      />

      {/* Top parallel */}
      <ellipse
        cx="50"
        cy="28"
        rx="36"
        ry="10"
        stroke="currentColor"
        strokeWidth="2.2"
        className="opacity-70"
      />

      {/* Bottom parallel */}
      <ellipse
        cx="50"
        cy="72"
        rx="36"
        ry="10"
        stroke="currentColor"
        strokeWidth="2.2"
        className="opacity-70"
      />

      {/* Prime Meridian (Vertical) */}
      <line
        x1="50"
        y1="6"
        x2="50"
        y2="94"
        stroke="currentColor"
        strokeWidth="2.4"
        className="opacity-80"
      />

      {/* Rotating Meridian Ellipses */}
      <ellipse
        ref={ring1Ref}
        cx="50"
        cy="50"
        rx="22"
        ry="44"
        stroke="currentColor"
        strokeWidth="2.4"
        className="opacity-80"
      />
      <ellipse
        ref={ring2Ref}
        cx="50"
        cy="50"
        rx="36"
        ry="44"
        stroke="currentColor"
        strokeWidth="1.8"
        className="opacity-60"
      />
    </svg>
  );
}

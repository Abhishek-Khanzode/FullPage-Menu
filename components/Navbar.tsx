"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
  scrolled?: boolean;
}

export default function Navbar({ isOpen, onToggle, scrolled = false }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const xIconRef = useRef<SVGSVGElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close button hover magnetic / rotation micro-interaction
  useGSAP(
    () => {
      const btn = closeBtnRef.current;
      const icon = xIconRef.current;
      if (!btn || !icon) return;

      const onEnter = () => {
        gsap.to(btn, { scale: 1.1, duration: 0.35, ease: "power2.out" });
        gsap.to(icon, { rotation: 90, duration: 0.4, ease: "power2.out" });
      };

      const onLeave = () => {
        gsap.to(btn, { scale: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(icon, { rotation: 0, duration: 0.4, ease: "power2.out" });
      };

      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);

      return () => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
      };
    },
    { dependencies: [isOpen], scope: navRef }
  );

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 pointer-events-none py-6 sm:py-8 px-8 sm:px-14 flex items-center justify-between ${
        scrolled && !isOpen ? "bg-[#edeae3]/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      {/* Brand Monogram: atelier studio® */}
      <a
        href="#home"
        onClick={(e) => {
          if (isOpen) {
            e.preventDefault();
            onToggle();
          }
        }}
        className="pointer-events-auto group flex items-baseline gap-1 cursor-pointer focus:outline-none"
        aria-label="atelier studio home"
      >
        <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111] group-hover:opacity-70 transition-opacity">
          atelier
        </span>
        <span className="font-sans text-xl sm:text-2xl font-light tracking-tight text-[#111111] ml-1 group-hover:opacity-70 transition-opacity">
          studio
        </span>
        <span className="text-[10px] sm:text-xs font-serif text-[#111111] -translate-y-2 ml-0.5">
          ®
        </span>
      </a>

      {/* Right Controls: Menu Trigger (when closed) or Circular Close (when open) */}
      <div className="pointer-events-auto flex items-center gap-4">
        {!isOpen ? (
          <button
            ref={triggerRef}
            onClick={onToggle}
            type="button"
            aria-expanded={false}
            aria-label="Open menu"
            className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#111111] text-[#edeae3] hover:bg-[#252525] transition-all duration-300 shadow-sm cursor-pointer"
          >
            <span className="font-sans text-xs tracking-widest font-semibold uppercase">
              Menu
            </span>
            <div className="relative w-4 h-2.5 flex flex-col justify-between">
              <span className="w-full h-[1.5px] bg-[#edeae3] group-hover:w-3/4 transition-all duration-300 self-end" />
              <span className="w-full h-[1.5px] bg-[#edeae3] group-hover:w-full transition-all duration-300" />
            </div>
          </button>
        ) : (
          <button
            ref={closeBtnRef}
            onClick={onToggle}
            type="button"
            aria-expanded={true}
            aria-label="Close navigation menu"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#141414] text-white flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-200"
          >
            <svg
              ref={xIconRef}
              className="w-4 h-4 sm:w-4.5 sm:h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

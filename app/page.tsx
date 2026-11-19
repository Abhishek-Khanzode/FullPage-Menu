"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import FullPageMenu from "@/components/FullPageMenu";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState("index");
  const heroRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for subtle header background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animations for the hero section
  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        hero.querySelectorAll(".editorial-fade"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, delay: 0.1 }
      );
    },
    { scope: heroRef }
  );

  return (
    <div className="relative min-h-screen bg-[#edeae3] text-[#111111] selection:bg-[#111111] selection:text-[#edeae3] flex flex-col justify-between">
      {/* Editorial Navbar with atelier studio® brand mark and Menu toggle */}
      <Navbar
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen((prev) => !prev)}
        scrolled={isScrolled}
      />

      {/* Awwwards Full-Page Menu with Liquid Curtain, Masked Serifs & Rotating Globe */}
      <FullPageMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeId={activeMenuId}
        onSelect={(id) => setActiveMenuId(id)}
      />

      {/* HERO SECTION ONLY */}
      <main
        id="home"
        ref={heroRef}
        className="relative z-10 flex-1 flex flex-col justify-between max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-16 pt-28 sm:pt-36 pb-12 sm:pb-16"
      >
        {/* Top Tagline */}
        <div className="editorial-fade flex items-center justify-between border-b border-black/[0.08] pb-5">
          <span className="font-mono text-xs uppercase tracking-widest text-[#777777]">
            Independent Digital Studio · London
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#777777] hidden sm:inline">
            Est. 2022
          </span>
        </div>

        {/* Main Editorial Headline */}
        <div className="my-auto py-8 sm:py-14">
          <h1 className="editorial-fade font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[120px] font-normal tracking-tight leading-[0.98] text-[#111111] max-w-6xl">
            Thoughtful craft <br />
            <span className="italic font-light text-[#555555]">for brands</span> that <br />
            shape modern culture.
          </h1>

          <div className="editorial-fade mt-10 pt-8 border-t border-black/[0.08]">
            <p className="font-sans text-base sm:text-lg text-[#555555] max-w-2xl font-normal leading-relaxed">
              An award-winning editorial navigation experience engineered with GSAP
              curtain morphs, masked typographic reveals, and interactive vector physics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

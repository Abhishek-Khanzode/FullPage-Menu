"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import WireframeGlobe from "./WireframeGlobe";

interface FullPageMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeId?: string;
  onSelect?: (id: string) => void;
}

interface MenuItem {
  id: string;
  num: string;
  title: string;
  href: string;
  hasGlobe?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "index",
    num: "01",
    title: "Index",
    href: "#index",
  },
  {
    id: "projects",
    num: "02",
    title: "Projects",
    href: "#projects",
  },
  {
    id: "contact",
    num: "03",
    title: "Contact",
    href: "#contact",
  },
  {
    id: "world",
    num: "04",
    title: "World",
    href: "#world",
    hasGlobe: true,
  },
];

const SOCIALS = [
  { name: "TWITTER", href: "https://twitter.com" },
  { name: "INSTAGRAM", href: "https://instagram.com" },
  { name: "LINKEDIN", href: "https://linkedin.com" },
  { name: "DRIBBBLE", href: "https://dribbble.com" },
  { name: "BEHANCE", href: "https://behance.net" },
];

export default function FullPageMenu({
  isOpen,
  onClose,
  activeId = "index",
  onSelect,
}: FullPageMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgCurtainRef = useRef<SVGPathElement>(null);
  const menuListRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const [activeItem, setActiveItem] = useState<string>(activeId);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [londonTime, setLondonTime] = useState<string>("10:35 AM");

  // Keep London time updated live
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setLondonTime(timeStr);
      } catch {
        setLondonTime("10:35 AM");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scrolling when menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // GSAP Organic Liquid Curtain & Editorial Entrance / Exit Choreography
  useGSAP(
    () => {
      const container = containerRef.current;
      const path = svgCurtainRef.current;
      const items = menuListRef.current?.querySelectorAll(".menu-item-row");
      const bottom = bottomBarRef.current;

      if (!container || !path) return;

      const tl = gsap.timeline();

      // Liquid SVG morphing curve coordinates
      const curveStart = "M 0 0 L 1 0 L 1 0 Q 0.5 0 0 0 Z";
      const curveMid = "M 0 0 L 1 0 L 1 0.85 Q 0.5 1.15 0 0.85 Z";
      const curveFlat = "M 0 0 L 1 0 L 1 1 Q 0.5 1 0 1 Z";

      if (isOpen) {
        gsap.set(container, { display: "block", pointerEvents: "auto" });

        // 1. Morph liquid curtain from top to bottom
        tl.set(path, { attr: { d: curveStart } });
        tl.to(path, {
          attr: { d: curveMid },
          duration: 0.55,
          ease: "power2.in",
        });
        tl.to(path, {
          attr: { d: curveFlat },
          duration: 0.45,
          ease: "power3.out",
        });

        // 2. Staggered Roll-up of large serif menu words
        if (items) {
          items.forEach((item, idx) => {
            const num = item.querySelector(".menu-item-num");
            const title = item.querySelector(".menu-item-title");
            const underline = item.querySelector(".menu-item-underline");

            if (title) {
              tl.fromTo(
                title,
                { yPercent: 120, rotate: 2, opacity: 0 },
                { yPercent: 0, rotate: 0, opacity: 1, duration: 0.85, ease: "power4.out" },
                0.35 + idx * 0.08
              );
            }

            if (num) {
              tl.fromTo(
                num,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
                0.4 + idx * 0.08
              );
            }

            if (underline) {
              tl.fromTo(
                underline,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 0.6, ease: "power3.out" },
                0.6
              );
            }
          });
        }

        // 3. Bottom info bars fade and slide up
        if (bottom) {
          tl.fromTo(
            bottom.querySelectorAll(".bottom-fade"),
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
            0.55
          );
        }
      } else {
        // Exit Animation: Arch liquid curtain up and vanish
        const curveExitMid = "M 0 0 Q 0.5 -0.15 1 0 L 1 0 Q 0.5 0 0 0 Z";

        const titles = menuListRef.current?.querySelectorAll(".menu-item-title");
        if (titles && titles.length > 0) {
          tl.to(
            titles,
            {
              yPercent: -100,
              opacity: 0,
              duration: 0.35,
              stagger: -0.02,
              ease: "power3.in",
            },
            0
          );
        }

        if (bottom) {
          tl.to(bottom, { opacity: 0, duration: 0.25 }, 0);
        }

        tl.to(path, {
          attr: { d: curveExitMid },
          duration: 0.55,
          ease: "power3.inOut",
        });

        tl.set(container, { display: "none", pointerEvents: "none" });
      }
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("projects@atelier.studio");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    e.preventDefault();
    setActiveItem(item.id);
    if (onSelect) onSelect(item.id);
    onClose();

    setTimeout(() => {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 450);
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      style={{ display: "none" }}
      className="fixed inset-0 z-40 w-full h-full select-none overflow-hidden"
    >
      {/* Liquid Organic SVG Curtain Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <path
          ref={svgCurtainRef}
          d="M 0 0 L 1 0 L 1 0 Q 0.5 0 0 0 Z"
          fill="#edeae3"
        />
      </svg>

      {/* Main Full-Page Menu Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-24 sm:pt-28 pb-8 sm:pb-12 flex flex-col justify-between">
        {/* Top Spacer matching Navbar height */}
        <div className="h-2 sm:h-4" />

        {/* Center Vertical Editorial Navigation List (Refined responsive typography) */}
        <div
          ref={menuListRef}
          className="flex flex-col items-center justify-center my-auto space-y-2 sm:space-y-3 md:space-y-4"
        >
          {MENU_ITEMS.map((item, index) => {
            const isActive = activeItem === item.id;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.id}
                className="menu-item-row relative flex items-start justify-center group overflow-hidden py-1 px-4"
              >
                {/* Superscript number: precisely anchored top-left */}
                <span className="menu-item-num font-sans text-xs sm:text-sm font-normal text-[#9b9b9b] mr-2 sm:mr-3 mt-1.5 sm:mt-3 select-none transition-colors duration-300 group-hover:text-[#111111]">
                  {item.num}
                </span>

                {/* Main Serif Link with Masked Overflow */}
                <div className="overflow-hidden relative inline-block">
                  <a
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="menu-item-title relative inline-flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-none"
                  >
                    <span
                      className={`font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[88px] leading-[1.05] tracking-tight transition-all duration-300 ${
                        isActive
                          ? "text-[#b4b0a8] font-light"
                          : "text-[#111111] font-normal group-hover:text-[#444444]"
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Rotating Wireframe Globe for "World" Item */}
                    {item.hasGlobe && (
                      <span className="ml-1 sm:ml-2.5 inline-flex items-center text-[#111111] translate-y-1 sm:translate-y-2">
                        <WireframeGlobe
                          size={36}
                          isHovered={isHovered}
                        />
                      </span>
                    )}
                  </a>

                  {/* Underline Bar (active state) */}
                  {isActive && (
                    <div className="menu-item-underline absolute bottom-0.5 sm:bottom-1 left-0 w-full h-[2px] bg-[#c8c4bc] rounded-full pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Stacked Contact (Left) & Stacked Socials (Right) */}
        <div
          ref={bottomBarRef}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 text-[#111111]"
        >
          {/* Bottom Left: Email & Phone Number with Live London Clock */}
          <div className="bottom-fade flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="font-sans text-sm sm:text-base font-normal hover:text-[#555555] transition-colors cursor-pointer text-left focus:outline-none flex items-center gap-2"
                title="Click to copy email"
              >
                <span>projects@atelier.studio</span>
                {copied && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#111111] bg-black/5 px-2 py-0.5 rounded">
                    Copied
                  </span>
                )}
              </button>
            </div>

            <a
              href="tel:+4401179226892"
              className="font-sans text-sm sm:text-base font-normal text-[#111111] hover:text-[#555555] transition-colors"
            >
              (+44) 0117 922 6892
            </a>

            <div className="pt-1.5 flex items-center gap-2 text-xs font-mono text-[#8e8d8a]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LONDON // {londonTime}</span>
            </div>
          </div>

          {/* Bottom Right: Clean Stacked Uppercase Social Links */}
          <div className="bottom-fade flex flex-col sm:items-end space-y-0.5 text-xs font-sans tracking-widest font-medium uppercase text-[#111111]">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#777777] transition-all duration-200 transform hover:-translate-x-1 py-0.5"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

export interface CircularCarouselProps {
  items: CarouselItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const VISIBLE_COUNT = 5;
const RADIUS_X = 320;
const RADIUS_Y = 140;

function getItemPosition(index: number, activeIndex: number, total: number, rx: number, ry: number) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  if (Math.abs(adjustedOffset) > half * 2) return null;

  const angle = (adjustedOffset / VISIBLE_COUNT) * Math.PI;
  const x = Math.sin(angle) * rx;
  const y = -Math.cos(angle) * ry;

  const distance = Math.abs(adjustedOffset);
  const maxDistance = half + 1;
  const isMobile = rx < 200;
  
  const scaleDrop = isMobile ? 0.6 : 0.3; 
  const opacityDrop = isMobile ? 0.9 : 0.7;
  const minOpacity = isMobile ? 0.05 : 0.3;

  const scale = Math.max(0, 1 - (distance / maxDistance) * scaleDrop);
  const opacity = Math.max(minOpacity, 1 - (distance / maxDistance) * opacityDrop);
  const zIndex = VISIBLE_COUNT - distance;

  return { x, y, scale, opacity, zIndex, adjustedOffset };
}

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
}: CircularCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [radii, setRadii] = useState({ rx: RADIUS_X, ry: RADIUS_Y });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateRadii = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadii({ rx: width * 0.35, ry: 90 });
      } else if (width < 1024) {
        setRadii({ rx: width * 0.25, ry: 110 });
      } else {
        setRadii({ rx: RADIUS_X, ry: RADIUS_Y });
      }
    };
    updateRadii();
    window.addEventListener("resize", updateRadii);
    return () => window.removeEventListener("resize", updateRadii);
  }, []);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      const newIndex = ((index % total) + total) % total;
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex);
      }
      onActiveChange?.(newIndex);
    },
    [total, controlledIndex, onActiveChange],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoPlay || isHovered || isFocused) return;
    intervalRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [next, prev]);

  const activeItem = items[activeIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "relative flex flex-col items-center justify-center gap-8 outline-none",
        className,
      )}
    >
      {/* Circular track */}
      <div className="relative h-[380px] w-full max-w-3xl">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const pos = getItemPosition(i, activeIndex, total, radii.rx, radii.ry);
            if (!pos) return null;

            const isActive = i === activeIndex;

            return (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => goTo(i)}
                aria-label={item.title}
                aria-selected={isActive}
                role="option"
                className={cn(
                  "absolute left-1/2 top-1/2 flex h-auto min-h-[10rem] w-[75vw] max-w-[16rem] sm:max-w-none sm:h-40 sm:w-64 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-start justify-center gap-3 rounded-2xl border border-[#F4C400]/50 bg-[#062E22] p-5 backdrop-blur-sm transition-shadow duration-300",
                  isActive
                    ? "shadow-[0_20px_60px_-12px_rgba(6,46,34,0.8)]"
                    : "shadow-[0_8px_24px_-4px_rgba(6,46,34,0.4)] hover:shadow-[0_12px_32px_-4px_rgba(6,46,34,0.6)]",
                )}
                style={{ transformOrigin: "center center" }}
              >
                {item.tag && (
                  <span className="rounded-full bg-[#E8235A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {item.tag}
                  </span>
                )}
                <div className="w-full">
                  <h3
                    className={cn(
                      "font-black leading-tight transition-colors duration-300 font-['Cinzel',serif]",
                      isActive
                        ? "text-[#F4C400] text-lg"
                        : "text-[#F4C400]/70 text-base",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed transition-colors duration-300 font-mono",
                      isActive ? "text-[#F9F6EE]/90" : "text-[#F9F6EE]/60",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Center content */}
      <motion.div
        key={activeItem.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <span className="text-5xl font-black tracking-tight text-[#062E22] font-['Cinzel',serif]">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs font-bold text-[#062E22]/60 font-mono">
          of {String(total).padStart(2, "0")}
        </span>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          aria-label="Previous item"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/50 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white focus-visible:ring-2 focus-visible:ring-black/50"
        >
          <ChevronLeft className="size-5" />
        </motion.button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-6 bg-[#E8235A]"
                  : "w-1.5 bg-[#062E22]/20 hover:bg-[#062E22]/40",
              )}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          aria-label="Next item"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/50 bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white focus-visible:ring-2 focus-visible:ring-black/50"
        >
          <ChevronRight className="size-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default CircularCarousel;

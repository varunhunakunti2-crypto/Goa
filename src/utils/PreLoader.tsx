"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onStartFadeOut }: { onStartFadeOut?: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderStarRef = useRef<HTMLDivElement>(null);
  const loaderNumberRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let countProgress = 0;

    // Start a smooth infinite spin
    gsap.to(loaderStarRef.current, {
      rotation: -360,
      duration: 2,
      ease: "linear",
      repeat: -1,
    });

    const prgInt = setInterval(() => {
      countProgress += Math.floor(Math.random() * 16); // Increment by a random value between 5 and 20

      if (countProgress >= 100) {
        countProgress = 100;
        clearInterval(prgInt);

        gsap.to(loaderStarRef.current, {
          scale: 100,
          delay: 0.2,
          duration: 0.45,
          ease: "power4.inOut",
          onComplete: () => {
            if (onStartFadeOut) onStartFadeOut();
            gsap.to(loaderRef.current, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                setIsVisible(false);
              },
            });
          },
        });
      }

      if (loaderNumberRef.current) {
        loaderNumberRef.current.textContent = countProgress + "%";
      }
    }, 80);

    return () => clearInterval(prgInt);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      id="loader" 
      ref={loaderRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#145726",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
      }}
    >
      <div
        id="loader-star"
        ref={loaderStarRef}
        style={{
          width: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "center",
        }}
      >
        <img
          src="/svg-star-white.svg"
          alt=""
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <h4 
        id="loader-number" 
        ref={loaderNumberRef}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "40px",
          fontSize: "7rem",
          fontWeight: "bold",
          margin: 0,
          color: "#F4C400"
        }}
      >
        0
      </h4>
    </div>
  );
}

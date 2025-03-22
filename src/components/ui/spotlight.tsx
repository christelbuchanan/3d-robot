"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  fill?: string;
}

export function Spotlight({
  className,
  fill = "white",
  ...props
}: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [size, setSize] = useState(0);

  const updateSpotlight = (x: number, y: number) => {
    if (!divRef.current) return;
    
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: x - rect.left, y: y - rect.top });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateSpotlight(e.clientX, e.clientY);
      setOpacity(1);
      setSize(500);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
      setSize(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={divRef}
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      {...props}
    >
      <div
        className="absolute -inset-px z-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${fill}, transparent 80%)`,
        }}
      />
    </div>
  );
}

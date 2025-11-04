import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

type MarqueeProps = {
  duration?: number;
  reverse?: boolean;
  className?: string;
  children: React.ReactNode;
};

const Marquee: React.FC<MarqueeProps> = ({
  duration = 20,
  reverse = false,
  className,
  children,
}) => {
  const x = useMotionValue(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = itemRef.current?.offsetWidth ?? 0;
      const cw = containerRef.current?.offsetWidth ?? 0;
      setContentWidth(w);
      setContainerWidth(cw);
    };
    update();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) {
      if (itemRef.current) ro.observe(itemRef.current);
      if (containerRef.current) ro.observe(containerRef.current);
    }

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (contentWidth > 0) {
      x.set(reverse ? -contentWidth : 0);
    }
  }, [contentWidth, reverse, x]);

  useAnimationFrame((_, delta) => {
    if (!contentWidth || !duration) return;
    const baseDistance = containerWidth || contentWidth;
    const pxPerSec = baseDistance / duration;
    const step = (pxPerSec * delta) / 1000;
    let next = x.get() + (reverse ? step : -step);

    if (!reverse && next <= -contentWidth) next += contentWidth;
    if (reverse && next >= 0) next -= contentWidth;
    x.set(next);
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className || ""}`}
    >
      <motion.div
        className="flex items-center whitespace-nowrap will-change-transform leading-none h-full"
        style={{ x }}
      >
        <div ref={itemRef} className="flex items-center shrink-0">
          {children}
        </div>
        <div className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Marquee;

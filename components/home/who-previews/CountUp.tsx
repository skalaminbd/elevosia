"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * Counts from 0 to `value` over `duration` seconds with ease-out. Mounts fresh
 * on each preview switch, so the count resets. Reduced motion shows the total.
 */
export function CountUp({
  value,
  duration = 3,
}: {
  value: number;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  const shown = reduceMotion ? value : count;

  return <span className="tabular-nums">{shown.toLocaleString("en-US")}</span>;
}

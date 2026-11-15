"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function LiveNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  step = 1,
  min,
  max,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  step?: number;
  min?: number;
  max?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    const id = setInterval(() => {
      setOffset((prev) => (prev >= 2 ? -2 : prev + 1));
    }, 2600);

    return () => clearInterval(id);
  }, [reduceMotion]);

  let next = value + offset * step;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);

  return (
    <>
      {prefix}
      {next.toFixed(decimals)}
      {suffix}
    </>
  );
}

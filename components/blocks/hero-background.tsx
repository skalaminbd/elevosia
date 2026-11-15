"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });

  const limeX = useTransform(springX, (value) => value * 56);
  const limeY = useTransform(springY, (value) => value * 40);

  useEffect(() => {
    if (reduceMotion) return;

    function onPointerMove(event: PointerEvent) {
      mouseX.set(event.clientX / window.innerWidth - 0.5);
      mouseY.set(event.clientY / window.innerHeight - 0.5);
    }

    window.addEventListener("pointermove", onPointerMove);

    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [mouseX, mouseY, reduceMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        style={{ x: limeX, y: limeY }}
        className="absolute -top-24 left-[12%] size-72 rounded-full bg-highlight/30 blur-3xl"
      />
    </div>
  );
}

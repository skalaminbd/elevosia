"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { createMap } from "svg-dotted-map";
import { DottedMap } from "@/components/ui/dotted-map";

const WIDTH = 200;
const HEIGHT = 104;
const SAMPLES = 1500;
const EASE_LINEAR = "linear";

const DHAKA = { lat: 23.8103, lng: 90.4125 };
const NEW_YORK = { lat: 40.7128, lng: -74.006 };

type Point = { x: number; y: number };

function arcPoints(from: Point, to: Point, steps = 28) {
  const control = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 34 };
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const inverse = 1 - t;
    return {
      x: inverse * inverse * from.x + 2 * inverse * t * control.x + t * t * to.x,
      y: inverse * inverse * from.y + 2 * inverse * t * control.y + t * t * to.y,
    };
  });
}

/**
 * Dotted world map with a live arc from Dhaka to New York.
 * Loaded with next/dynamic (ssr: false) because it renders thousands of dots.
 */
export default function TeamMap({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  const { from, to, path, travel } = useMemo(() => {
    const { addMarkers } = createMap({
      width: WIDTH,
      height: HEIGHT,
      mapSamples: SAMPLES,
    });
    const [dhaka, newYork] = addMarkers([DHAKA, NEW_YORK]);
    const points = arcPoints(dhaka, newYork);
    const d = points
      .map((point, index) =>
        index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
      )
      .join(" ");
    return {
      from: dhaka,
      to: newYork,
      path: d,
      travel: points,
    };
  }, []);

  return (
    <div className="relative aspect-[25/13] w-full">
      <DottedMap
        width={WIDTH}
        height={HEIGHT}
        mapSamples={SAMPLES}
        stagger={false}
        dotRadius={0.24}
        dotColor="color-mix(in srgb, var(--muted-foreground) 42%, transparent)"
        markerColor="var(--highlight)"
        markers={[
          { ...DHAKA, size: 1.1, pulse: !reduceMotion },
          { ...NEW_YORK, size: 1.1, pulse: !reduceMotion },
        ]}
        className="overflow-visible"
      />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={path}
          fill="none"
          stroke="var(--success)"
          strokeWidth={0.4}
          strokeDasharray="1.4 1.6"
          strokeOpacity={0.55}
        />

        {!reduceMotion ? (
          <motion.circle
            r={0.9}
            fill="var(--highlight)"
            animate={{
              cx: travel.map((point) => point.x),
              cy: travel.map((point) => point.y),
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: EASE_LINEAR,
              repeatDelay: 1.2,
            }}
          />
        ) : (
          <circle cx={travel[travel.length - 1].x} cy={travel[travel.length - 1].y} r={0.9} fill="var(--highlight)" />
        )}

        <text
          x={from.x + 3}
          y={from.y + 1}
          className="fill-foreground text-[4px] font-medium"
        >
          Dhaka
        </text>
        <text
          x={to.x - 3}
          y={to.y - 3}
          textAnchor="end"
          className="fill-foreground text-[4px] font-medium"
        >
          New York
        </text>
      </svg>
    </div>
  );
}

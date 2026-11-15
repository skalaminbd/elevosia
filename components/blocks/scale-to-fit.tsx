"use client";

import { useEffect, useRef, useState } from "react";

export function ScaleToFit({
  designWidth,
  children,
}: {
  designWidth: number;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const outerEl: HTMLDivElement = outer;
    const innerEl: HTMLDivElement = inner;

    function update() {
      const available = outerEl.clientWidth;
      if (!available) return;

      const nextScale = Math.min(1, available / designWidth);
      const nextHeight = innerEl.offsetHeight * nextScale;

      setScale((prev) =>
        Math.abs(prev - nextScale) < 0.001 ? prev : nextScale,
      );
      setHeight((prev) =>
        prev !== undefined && Math.abs(prev - nextHeight) < 0.5
          ? prev
          : nextHeight,
      );
    }

    update();

    const observer = new ResizeObserver(update);
    observer.observe(outerEl);
    observer.observe(innerEl);

    return () => observer.disconnect();
  }, [designWidth]);

  return (
    <div ref={outerRef} className="w-full overflow-hidden" style={{ height }}>
      <div
        ref={innerRef}
        className="origin-top-left"
        style={{ width: designWidth, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

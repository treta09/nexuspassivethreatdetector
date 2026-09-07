import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";

// ── Pull-to-Refresh ───────────────────────────────────────────────────────
// Native-style pull-to-refresh for touch scroll containers. Only activates
// when the user pulls down from the very top of the scroll area
// (scrollTop <= 0), so desktop wheel scrolling and normal mobile scrolling are
// completely untouched. On release past the threshold it calls `onRefresh`
// (an async poll) and shows a spinner until it resolves.
//
// Usage: <PullToRefresh onRefresh={refresh} className="…overflow handled here">
//          {scrollable children}
//        </PullToRefresh>
// The component renders its own overflow-y-auto container, so callers should
// NOT add overflow-y-auto themselves (padding/spacing classes are fine).

const THRESHOLD = 70;
const RESISTANCE = 0.5;
const MAX_PULL = 120;

export default function PullToRefresh({ onRefresh, className = "", children }) {
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [pulling, setPulling] = useState(false);

  // Keep a ref mirror of pullDistance so the touchend handler can read the
  // latest value without re-binding listeners on every move.
  const setPull = (v) => {
    pullDistanceRef.current = v;
    setPullDistance(v);
  };

  const handleTouchStart = useCallback((e) => {
    const el = containerRef.current;
    if (!el || refreshing) return;
    if (el.scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    } else {
      pullingRef.current = false;
    }
  }, [refreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!pullingRef.current) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta <= 0) { setPull(0); return; }
    // Prevent the browser's own overscroll while we're handling the pull.
    e.preventDefault();
    setPulling(true);
    setPull(Math.min(delta * RESISTANCE, MAX_PULL));
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pullingRef.current) return;
    pullingRef.current = false;
    setPulling(false);
    if (pullDistanceRef.current >= THRESHOLD) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  }, [onRefresh]);

  // Attach non-passive touchmove so preventDefault works during a pull.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(1, pullDistance / THRESHOLD);

  return (
    <div ref={containerRef} className={`relative overflow-y-auto ${className}`}>
      {/* Indicator spacer: grows with the pull, pushing content down. */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ height: pullDistance, transition: pulling ? "none" : "height 0.25s ease" }}
      >
        {refreshing ? (
          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
        ) : (
          <ChevronDown
            className="w-5 h-5 text-muted-foreground transition-transform"
            style={{ transform: `rotate(${progress * 180}deg)`, opacity: progress }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
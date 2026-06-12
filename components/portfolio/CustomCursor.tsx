"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface CustomCursorProps {
  cursorStyle?: "default" | "dot" | "ring" | "crosshair";
}

export function CustomCursor({ cursorStyle = "default" }: CustomCursorProps) {
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const trailX = useSpring(cursorX, { damping: 35, stiffness: 200 });
  const trailY = useSpring(cursorY, { damping: 35, stiffness: 200 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(cursorX.get(), cursorY.get());
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement);
        const isClickable =
          computedStyle.cursor === "pointer" ||
          hoveredElement.tagName === "BUTTON" ||
          hoveredElement.tagName === "A" ||
          hoveredElement.closest("button") ||
          hoveredElement.closest("a") ||
          hoveredElement.getAttribute("role") === "button";
        setIsPointer(Boolean(isClickable));
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    const intervalId = setInterval(updateCursorType, 50);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(intervalId);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  const renderCursor = () => {
    switch (cursorStyle) {
      case "dot":
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: cursorXSpring, y: cursorYSpring }}
            animate={{ scale: isPressed ? 0.7 : isPointer ? 1.8 : 1, opacity: isHidden ? 0 : 1 }}
          >
            <div className="w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(96,165,250,0.6)]" />
          </motion.div>
        );

      case "ring":
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: cursorXSpring, y: cursorYSpring }}
            animate={{ scale: isPressed ? 0.8 : isPointer ? 1.5 : 1, opacity: isHidden ? 0 : 1 }}
          >
            <div
              className="-translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80"
              style={{ width: isPointer ? "36px" : "22px", height: isPointer ? "36px" : "22px", transition: "width 0.15s, height 0.15s" }}
            />
          </motion.div>
        );

      case "crosshair":
        return (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: cursorXSpring, y: cursorYSpring }}
            animate={{ scale: isPressed ? 0.8 : isPointer ? 1.3 : 1, opacity: isHidden ? 0 : 1 }}
          >
            <div className="relative w-6 h-6 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/90 -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/90 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
            </div>
          </motion.div>
        );

      default:
        return (
          <>
            {/* Outer ring */}
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9999]"
              style={{ x: cursorXSpring, y: cursorYSpring }}
              animate={{
                scale: isPressed ? 0.85 : isPointer ? 1.6 : 1,
                opacity: isHidden ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div
                className="-translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-150"
                style={{
                  width: "32px",
                  height: "32px",
                  borderWidth: isPointer ? "1.5px" : "1px",
                  borderColor: isPointer
                    ? "rgba(96,165,250,0.9)"
                    : "rgba(255,255,255,0.55)",
                  background: isPointer
                    ? "rgba(96,165,250,0.08)"
                    : "transparent",
                  boxShadow: isPointer
                    ? "0 0 16px 2px rgba(96,165,250,0.35)"
                    : "none",
                }}
              />
            </motion.div>

            {/* Inner dot */}
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9999]"
              style={{ x: cursorXSpring, y: cursorYSpring }}
              animate={{
                scale: isPressed ? 1.6 : isPointer ? 0 : 1,
                opacity: isHidden ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              <div
                className="w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.5)]"
              />
            </motion.div>

            {/* Soft trailing glow */}
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9998]"
              style={{ x: trailX, y: trailY }}
              animate={{ opacity: isHidden ? 0 : isPointer ? 0.25 : 0.18 }}
            >
              <div
                className="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(96,165,250,0.5) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          </>
        );
    }
  };

  return (
    <>
      {renderCursor()}
      <style jsx global>{`* { cursor: none !important; }`}</style>
    </>
  );
}

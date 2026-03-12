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
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
              style={{ x: cursorXSpring, y: cursorYSpring }}
              animate={{ scale: isPressed ? 0.8 : isPointer ? 1.5 : 1, opacity: isHidden ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              <div
                className="relative -translate-x-1/2 -translate-y-1/2"
                style={{ width: isPointer ? "40px" : "12px", height: isPointer ? "40px" : "12px" }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white"
                  animate={{ scale: isPointer ? 1 : 0, opacity: isPointer ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
                <motion.div
                  className="absolute rounded-full bg-white"
                  style={{ width: "12px", height: "12px", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                  animate={{ scale: isPointer ? 0.4 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </div>
            </motion.div>
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9998]"
              style={{ x: trailX, y: trailY }}
              animate={{ opacity: isHidden ? 0 : 0.3 }}
            >
              <div
                className="w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)" }}
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

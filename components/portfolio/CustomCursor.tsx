"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

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
      const hoveredElement = document.elementFromPoint(
        cursorX.get(),
        cursorY.get()
      );
      
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

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isPressed ? 0.8 : isPointer ? 1.5 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div 
          className="relative -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isPointer ? "40px" : "12px",
            height: isPointer ? "40px" : "12px",
          }}
        >
          {/* Outer ring (visible on hover) */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isPointer ? 1 : 0,
              opacity: isPointer ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
          
          {/* Inner dot */}
          <motion.div
            className="absolute rounded-full bg-white"
            style={{
              width: "12px",
              height: "12px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: isPointer ? 0.4 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        </div>
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: useSpring(cursorX, { damping: 35, stiffness: 200 }),
          y: useSpring(cursorY, { damping: 35, stiffness: 200 }),
        }}
        animate={{
          opacity: isHidden ? 0 : 0.3,
        }}
      >
        <div 
          className="w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}

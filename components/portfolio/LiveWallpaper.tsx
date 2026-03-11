"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface GradientOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  hue: number;
}

export function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<GradientOrb[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const initOrbs = useCallback((width: number, height: number) => {
    const colors = [
      { color: "rgba(138, 43, 226, 0.6)", hue: 280 },  // Purple
      { color: "rgba(255, 105, 180, 0.5)", hue: 330 }, // Pink
      { color: "rgba(0, 191, 255, 0.5)", hue: 195 },   // Cyan
      { color: "rgba(255, 69, 0, 0.4)", hue: 15 },     // Orange-red
      { color: "rgba(50, 205, 50, 0.4)", hue: 120 },   // Green
      { color: "rgba(255, 215, 0, 0.35)", hue: 50 },   // Gold
    ];

    orbsRef.current = colors.map((c, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.min(width, height) * (0.3 + Math.random() * 0.3),
      color: c.color,
      hue: c.hue,
    }));
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Get spring values for smooth mouse influence
    const mx = springX.get();
    const my = springY.get();

    // Clear with dark background
    ctx.fillStyle = "rgb(12, 12, 20)";
    ctx.fillRect(0, 0, width, height);

    // Update and draw orbs
    orbsRef.current.forEach((orb, index) => {
      // Subtle mouse influence
      const dx = (mx - 0.5) * 30;
      const dy = (my - 0.5) * 30;
      
      // Add slight attraction to mouse position
      const attractX = (mx * width - orb.x) * 0.0003;
      const attractY = (my * height - orb.y) * 0.0003;
      
      orb.vx += attractX;
      orb.vy += attractY;
      
      // Apply velocity with damping
      orb.vx *= 0.995;
      orb.vy *= 0.995;
      
      orb.x += orb.vx + dx * 0.01;
      orb.y += orb.vy + dy * 0.01;

      // Wrap around edges with padding
      const padding = orb.radius;
      if (orb.x < -padding) orb.x = width + padding;
      if (orb.x > width + padding) orb.x = -padding;
      if (orb.y < -padding) orb.y = height + padding;
      if (orb.y > height + padding) orb.y = -padding;

      // Create radial gradient for each orb
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius
      );
      
      // Shift hue slightly based on mouse position
      const hueShift = (mx - 0.5) * 20;
      const adjustedHue = (orb.hue + hueShift + 360) % 360;
      
      gradient.addColorStop(0, `hsla(${adjustedHue}, 80%, 55%, 0.8)`);
      gradient.addColorStop(0.4, `hsla(${adjustedHue}, 70%, 45%, 0.4)`);
      gradient.addColorStop(1, `hsla(${adjustedHue}, 60%, 35%, 0)`);

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add subtle noise/grain overlay
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = `rgba(128, 128, 128, 0.03)`;
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.globalCompositeOperation = "source-over";

    animationRef.current = requestAnimationFrame(animate);
  }, [springX, springY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initOrbs(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
      mouseRef.current = { x, y };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initOrbs, mouseX, mouseY]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}

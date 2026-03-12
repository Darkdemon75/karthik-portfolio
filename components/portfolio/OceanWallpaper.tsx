"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Bubble {
  x: number; y: number; r: number; speed: number;
  opacity: number; wobble: number; wobbleSpeed: number; wobbleOffset: number;
}
interface Ray {
  x: number; angle: number; width: number; opacity: number; speed: number;
}
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string;
}
interface Fish {
  x: number; y: number; speed: number; size: number;
  color: string; waveOffset: number; flip: boolean;
}

interface OceanWallpaperProps {
  theme?: "dark" | "light";
}

export function OceanWallpaper({ theme = "dark" }: OceanWallpaperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const bubblesRef = useRef<Bubble[]>([]);
  const raysRef = useRef<Ray[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const fishRef = useRef<Fish[]>([]);
  const frameRef = useRef(0);
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  const initScene = useCallback((width: number, height: number) => {
    bubblesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      r: 2 + Math.random() * 10,
      speed: 0.3 + Math.random() * 0.8,
      opacity: 0.1 + Math.random() * 0.3,
      wobble: 0,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      wobbleOffset: Math.random() * Math.PI * 2,
    }));
    raysRef.current = Array.from({ length: 10 }, (_, i) => ({
      x: width * (0.05 + i * 0.1),
      angle: -0.25 + Math.random() * 0.5,
      width: 30 + Math.random() * 70,
      opacity: 0.04 + Math.random() * 0.08,
      speed: 0.001 + Math.random() * 0.002,
    }));
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      size: 0.5 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.4,
      color: ["100,200,255", "80,180,220", "60,160,200", "120,220,255"][Math.floor(Math.random() * 4)],
    }));
    fishRef.current = Array.from({ length: 8 }, () => ({
      x: Math.random() * width,
      y: height * 0.3 + Math.random() * height * 0.45,
      speed: 0.4 + Math.random() * 0.6,
      size: 12 + Math.random() * 18,
      color: ["255,180,80", "255,120,60", "80,200,255", "255,220,60", "180,100,255"][Math.floor(Math.random() * 5)],
      waveOffset: Math.random() * Math.PI * 2,
      flip: Math.random() > 0.5,
    }));
  }, []);

  const drawFish = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, flip: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    ctx.fillStyle = `rgba(${color}, 0.7)`;
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, 0);
    ctx.lineTo(-size * 1.3, -size * 0.45);
    ctx.lineTo(-size * 1.3, size * 0.45);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.05, size * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fill();
    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    frameRef.current++;
    const t = frameRef.current;
    const isDay = themeRef.current === "light";

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isDay) {
      bgGrad.addColorStop(0, "rgb(0, 120, 220)");
      bgGrad.addColorStop(0.2, "rgb(0, 160, 210)");
      bgGrad.addColorStop(0.5, "rgb(0, 180, 200)");
      bgGrad.addColorStop(0.75, "rgb(0, 140, 170)");
      bgGrad.addColorStop(1, "rgb(0, 80, 120)");
    } else {
      bgGrad.addColorStop(0, "rgb(0, 20, 60)");
      bgGrad.addColorStop(0.2, "rgb(0, 35, 80)");
      bgGrad.addColorStop(0.5, "rgb(0, 50, 100)");
      bgGrad.addColorStop(0.75, "rgb(0, 30, 70)");
      bgGrad.addColorStop(1, "rgb(0, 10, 30)");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Light rays
    raysRef.current.forEach((ray, i) => {
      ray.x += Math.sin(t * ray.speed + i) * 0.3;
      if (ray.x > width + 100) ray.x = -100;
      if (ray.x < -100) ray.x = width + 100;
      const pulse = ray.opacity * (isDay ? 2.5 : 1) * (0.7 + Math.sin(t * 0.008 + i * 1.2) * 0.3);
      const rayGrad = ctx.createLinearGradient(ray.x, 0, ray.x + Math.sin(ray.angle) * height, height);
      if (isDay) {
        rayGrad.addColorStop(0, `rgba(255, 240, 180, ${pulse})`);
        rayGrad.addColorStop(0.3, `rgba(200, 240, 255, ${pulse * 0.5})`);
        rayGrad.addColorStop(1, `rgba(100, 200, 255, 0)`);
      } else {
        rayGrad.addColorStop(0, `rgba(100,200,255,${pulse})`);
        rayGrad.addColorStop(0.4, `rgba(80,180,240,${pulse * 0.5})`);
        rayGrad.addColorStop(1, `rgba(60,150,220,0)`);
      }
      ctx.save();
      ctx.translate(ray.x, 0);
      ctx.rotate(ray.angle);
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(-ray.width / 2, 0);
      ctx.lineTo(ray.width / 2, 0);
      ctx.lineTo(ray.width * 1.5, height * 1.5);
      ctx.lineTo(-ray.width * 1.5, height * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Particles
    particlesRef.current.forEach(p => {
      p.x += p.vx + Math.sin(t * 0.01 + p.y * 0.01) * 0.15;
      p.y += p.vy + Math.cos(t * 0.008 + p.x * 0.01) * 0.1;
      if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      const alpha = isDay ? p.opacity * 0.5 : p.opacity;
      glow.addColorStop(0, `rgba(${p.color},${alpha})`);
      glow.addColorStop(1, `rgba(${p.color},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Fish (day only — more vivid)
    if (isDay) {
      fishRef.current.forEach(fish => {
        fish.x += fish.flip ? -fish.speed : fish.speed;
        fish.y += Math.sin(t * 0.02 + fish.waveOffset) * 0.4;
        if (fish.x > width + 100) fish.x = -100;
        if (fish.x < -100) fish.x = width + 100;
        drawFish(ctx, fish.x, fish.y, fish.size, fish.color, fish.flip);
      });
    }

    // Bubbles
    bubblesRef.current.forEach(b => {
      b.y -= b.speed;
      b.wobble = Math.sin(t * b.wobbleSpeed + b.wobbleOffset) * 15;
      if (b.y + b.r < 0) { b.y = height + b.r; b.x = Math.random() * width; }
      const bx = b.x + b.wobble;
      const bubbleGrad = ctx.createRadialGradient(bx - b.r * 0.3, b.y - b.r * 0.3, 0, bx, b.y, b.r);
      bubbleGrad.addColorStop(0, `rgba(200,240,255,${b.opacity * 0.6})`);
      bubbleGrad.addColorStop(0.5, `rgba(100,200,255,${b.opacity * 0.2})`);
      bubbleGrad.addColorStop(1, `rgba(80,180,240,${b.opacity * 0.4})`);
      ctx.beginPath();
      ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = bubbleGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180,230,255,${b.opacity * 0.5})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx - b.r * 0.3, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${b.opacity * 0.6})`;
      ctx.fill();
    });

    // Surface waves
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= width; x += 5) {
      const wave = Math.sin(x * 0.015 + t * 0.02) * 8 + Math.sin(x * 0.025 - t * 0.015) * 5;
      ctx.lineTo(x, wave + 25);
    }
    ctx.lineTo(width, 0);
    ctx.closePath();
    const surfaceGrad = ctx.createLinearGradient(0, 0, 0, 40);
    if (isDay) {
      surfaceGrad.addColorStop(0, "rgba(100,200,255,0.95)");
      surfaceGrad.addColorStop(0.5, "rgba(60,180,240,0.7)");
      surfaceGrad.addColorStop(1, "rgba(0,160,220,0)");
    } else {
      surfaceGrad.addColorStop(0, "rgba(10,100,200,0.95)");
      surfaceGrad.addColorStop(0.5, "rgba(0,60,140,0.7)");
      surfaceGrad.addColorStop(1, "rgba(0,40,100,0)");
    }
    ctx.fillStyle = surfaceGrad;
    ctx.fill();

    // Surface shimmer
    for (let x = 0; x < width; x += 3) {
      const wave = Math.sin(x * 0.015 + t * 0.02) * 8 + Math.sin(x * 0.025 - t * 0.015) * 5;
      const shimmer = Math.sin(x * 0.05 + t * 0.04) * 0.5 + 0.5;
      if (shimmer > 0.7) {
        ctx.beginPath();
        ctx.arc(x, wave + 20, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${isDay ? "255,255,255" : "200,240,255"},${shimmer * (isDay ? 0.6 : 0.3)})`;
        ctx.fill();
      }
    }

    // Seabed
    const seabedGrad = ctx.createLinearGradient(0, height - 80, 0, height);
    seabedGrad.addColorStop(0, isDay ? "rgba(0,80,120,0)" : "rgba(0,15,40,0)");
    seabedGrad.addColorStop(1, isDay ? "rgba(0,50,80,1)" : "rgba(0,8,20,1)");
    ctx.fillStyle = seabedGrad;
    ctx.fillRect(0, height - 80, width, 80);

    // Ambient centre glow
    const centreGlow = ctx.createRadialGradient(width / 2, height * 0.35, 0, width / 2, height * 0.35, width * 0.4);
    centreGlow.addColorStop(0, `rgba(${isDay ? "0,200,255" : "0,120,220"},${0.06 + Math.sin(t * 0.007) * 0.02})`);
    centreGlow.addColorStop(1, "rgba(0,60,150,0)");
    ctx.fillStyle = centreGlow;
    ctx.fillRect(0, 0, width, height);

    animationRef.current = requestAnimationFrame(animate);
  }, [drawFish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initScene(canvas.width, canvas.height);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initScene]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
}

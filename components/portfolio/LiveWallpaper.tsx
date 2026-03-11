"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Jet {
  x: number;
  y: number;
  speed: number;
  size: number;
  yDrift: number;
  driftSpeed: number;
  driftOffset: number;
  trail: { x: number; y: number; age: number }[];
  afterburnerIntensity: number;
}

interface Lightning {
  points: { x: number; y: number }[];
  opacity: number;
  maxOpacity: number;
  decay: number;
  branches: { points: { x: number; y: number }[]; opacity: number }[];
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

interface StormCloud {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  opacity: number;
  darkLevel: number;
}

export function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const jetsRef = useRef<Jet[]>([]);
  const lightningRef = useRef<Lightning[]>([]);
  const rainRef = useRef<RainDrop[]>([]);
  const cloudsRef = useRef<StormCloud[]>([]);
  const frameRef = useRef(0);
  const nextLightningRef = useRef(0);

  const initScene = useCallback((width: number, height: number) => {
    // Storm clouds
    cloudsRef.current = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * width * 1.5 - width * 0.25,
      y: Math.random() * height * 0.6,
      w: 250 + Math.random() * 350,
      h: 80 + Math.random() * 120,
      speed: 0.05 + Math.random() * 0.1,
      opacity: 0.3 + Math.random() * 0.5,
      darkLevel: 0.4 + Math.random() * 0.6,
    }));

    // Rain
    rainRef.current = Array.from({ length: 400 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 8 + Math.random() * 6,
      length: 15 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.25,
    }));

    // Jets
    jetsRef.current = [
      { x: -300, y: height * 0.25, speed: 2.2, size: 22, yDrift: 0, driftSpeed: 0.012, driftOffset: 0, trail: [], afterburnerIntensity: 1 },
      { x: -800, y: height * 0.38, speed: 1.8, size: 16, yDrift: 0, driftSpeed: 0.009, driftOffset: Math.PI, trail: [], afterburnerIntensity: 0.8 },
    ];
  }, []);

  const generateLightning = useCallback((width: number, height: number) => {
    const startX = Math.random() * width;
    const startY = 0;
    const points: { x: number; y: number }[] = [{ x: startX, y: startY }];
    let cx = startX, cy = startY;
    const steps = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < steps; i++) {
      cx += (Math.random() - 0.5) * 80;
      cy += height / steps * (0.8 + Math.random() * 0.4);
      points.push({ x: cx, y: cy });
    }

    // Branches
    const branches = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const branchFrom = Math.floor(Math.random() * (points.length - 2)) + 1;
      const bp = [{ ...points[branchFrom] }];
      let bx = bp[0].x, by = bp[0].y;
      const bSteps = 4 + Math.floor(Math.random() * 4);
      for (let i = 0; i < bSteps; i++) {
        bx += (Math.random() - 0.5) * 60;
        by += (height / steps) * (0.6 + Math.random() * 0.5);
        bp.push({ x: bx, y: by });
      }
      return { points: bp, opacity: 0.6 };
    });

    lightningRef.current.push({
      points,
      opacity: 0.9 + Math.random() * 0.1,
      maxOpacity: 0.9,
      decay: 0.04 + Math.random() * 0.03,
      branches,
    });
  }, []);

  const drawJet = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);

    // Fuselage
    ctx.fillStyle = "rgba(180, 190, 210, 0.9)";
    ctx.beginPath();
    ctx.moveTo(size * 2.2, 0);
    ctx.lineTo(-size * 1.2, -size * 0.22);
    ctx.lineTo(-size * 1.8, 0);
    ctx.lineTo(-size * 1.2, size * 0.22);
    ctx.closePath();
    ctx.fill();

    // Wings
    ctx.fillStyle = "rgba(160, 175, 200, 0.85)";
    ctx.beginPath();
    ctx.moveTo(size * 0.2, 0);
    ctx.lineTo(-size * 0.5, -size * 1.2);
    ctx.lineTo(-size * 1.2, -size * 1.05);
    ctx.lineTo(-size * 0.7, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(size * 0.2, 0);
    ctx.lineTo(-size * 0.5, size * 1.2);
    ctx.lineTo(-size * 1.2, size * 1.05);
    ctx.lineTo(-size * 0.7, 0);
    ctx.closePath();
    ctx.fill();

    // Tail
    ctx.fillStyle = "rgba(140, 155, 180, 0.8)";
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, 0);
    ctx.lineTo(-size * 1.4, -size * 0.6);
    ctx.lineTo(-size * 1.8, -size * 0.5);
    ctx.lineTo(-size * 1.2, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-size * 0.8, 0);
    ctx.lineTo(-size * 1.4, size * 0.6);
    ctx.lineTo(-size * 1.8, size * 0.5);
    ctx.lineTo(-size * 1.2, 0);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    const cockpitGrad = ctx.createRadialGradient(size * 0.7, -size * 0.05, 0, size * 0.7, -size * 0.05, size * 0.3);
    cockpitGrad.addColorStop(0, "rgba(100, 200, 255, 0.9)");
    cockpitGrad.addColorStop(1, "rgba(50, 120, 200, 0)");
    ctx.fillStyle = cockpitGrad;
    ctx.beginPath();
    ctx.ellipse(size * 0.7, -size * 0.05, size * 0.3, size * 0.13, 0, 0, Math.PI * 2);
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

    // Dark stormy sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "rgb(3, 4, 10)");
    skyGrad.addColorStop(0.3, "rgb(8, 10, 22)");
    skyGrad.addColorStop(0.7, "rgb(15, 18, 35)");
    skyGrad.addColorStop(1, "rgb(20, 22, 40)");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Storm clouds
    cloudsRef.current.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x - cloud.w > width) cloud.x = -cloud.w;

      const cg = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.w / 2);
      const base = Math.floor(15 * cloud.darkLevel);
      cg.addColorStop(0, `rgba(${base + 10}, ${base + 8}, ${base + 20}, ${cloud.opacity})`);
      cg.addColorStop(0.5, `rgba(${base + 5}, ${base + 4}, ${base + 12}, ${cloud.opacity * 0.6})`);
      cg.addColorStop(1, `rgba(${base}, ${base - 2}, ${base + 8}, 0)`);
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.w / 2, cloud.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Rain
    ctx.save();
    rainRef.current.forEach(drop => {
      drop.y += drop.speed;
      drop.x -= drop.speed * 0.15;
      if (drop.y > height) { drop.y = -drop.length; drop.x = Math.random() * width; }
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.length * 0.15, drop.y + drop.length);
      ctx.strokeStyle = `rgba(150, 180, 220, ${drop.opacity})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });
    ctx.restore();

    // Lightning
    if (t >= nextLightningRef.current) {
      generateLightning(width, height);
      nextLightningRef.current = t + 80 + Math.floor(Math.random() * 180);
    }

    lightningRef.current = lightningRef.current.filter(l => l.opacity > 0);
    lightningRef.current.forEach(l => {
      // Flash effect on whole canvas
      if (l.opacity > 0.7) {
        ctx.fillStyle = `rgba(150, 160, 255, ${(l.opacity - 0.7) * 0.08})`;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(180, 200, 255, 0.9)";
      ctx.strokeStyle = `rgba(220, 230, 255, ${l.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      l.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Inner bright core
      ctx.strokeStyle = `rgba(255, 255, 255, ${l.opacity * 0.8})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Branches
      l.branches.forEach(b => {
        ctx.strokeStyle = `rgba(200, 215, 255, ${l.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        b.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      });

      ctx.restore();
      l.opacity -= l.decay;
    });

    // Jets
    jetsRef.current.forEach(jet => {
      jet.y += Math.sin(t * jet.driftSpeed + jet.driftOffset) * 0.4;
      jet.x += jet.speed;

      if (jet.x > width + 400) {
        jet.x = -400;
        jet.y = height * (0.15 + Math.random() * 0.45);
        jet.trail = [];
      }

      jet.trail.unshift({ x: jet.x, y: jet.y, age: 0 });
      jet.trail = jet.trail.slice(0, 120).map(p => ({ ...p, age: p.age + 1 }));

      // Contrail
      jet.trail.forEach((pt, i) => {
        const alpha = Math.max(0, (1 - i / jet.trail.length) * 0.2 - pt.age * 0.001);
        const w = (1 - i / jet.trail.length) * jet.size * 0.2;
        ctx.beginPath();
        ctx.arc(pt.x - jet.size * 1.8, pt.y, w, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 230, ${alpha})`;
        ctx.fill();
      });

      // Afterburner glow
      const abIntensity = jet.afterburnerIntensity * (0.8 + Math.sin(t * 0.3) * 0.2);
      const ab1 = ctx.createRadialGradient(jet.x - jet.size * 2, jet.y, 0, jet.x - jet.size * 2, jet.y, jet.size * 3);
      ab1.addColorStop(0, `rgba(255, 200, 80, ${0.95 * abIntensity})`);
      ab1.addColorStop(0.3, `rgba(255, 100, 20, ${0.6 * abIntensity})`);
      ab1.addColorStop(0.7, `rgba(255, 40, 0, ${0.3 * abIntensity})`);
      ab1.addColorStop(1, "rgba(255, 0, 0, 0)");
      ctx.fillStyle = ab1;
      ctx.beginPath();
      ctx.ellipse(jet.x - jet.size * 2.2, jet.y, jet.size * 3, jet.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Jet body glow in storm
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(150, 180, 255, 0.4)";
      drawJet(ctx, jet.x, jet.y, jet.size);
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [generateLightning, drawJet]);

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

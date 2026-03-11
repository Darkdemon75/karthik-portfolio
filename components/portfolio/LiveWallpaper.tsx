"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  active: boolean;
}

interface NebulaOrb {
  x: number;
  y: number;
  radius: number;
  hue: number;
  opacity: number;
}

export function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaRef = useRef<NebulaOrb[]>([]);
  const frameRef = useRef(0);
  const nextShootingStarRef = useRef(0);
  const mountainCacheRef = useRef<ImageData | null>(null);

  const starColors = ["255,255,255", "200,220,255", "255,220,200", "180,200,255", "255,255,220"];

  const initScene = useCallback((width: number, height: number) => {
    // Stars
    starsRef.current = Array.from({ length: 350 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.78,
      size: Math.random() * 1.8 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Shooting stars pool
    shootingStarsRef.current = Array.from({ length: 5 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, length: 0, opacity: 0, active: false,
    }));

    // Nebula orbs
    nebulaRef.current = [
      { x: width * 0.15, y: height * 0.18, radius: width * 0.22, hue: 280, opacity: 0.07 },
      { x: width * 0.7, y: height * 0.12, radius: width * 0.28, hue: 200, opacity: 0.06 },
      { x: width * 0.45, y: height * 0.3, radius: width * 0.18, hue: 320, opacity: 0.05 },
      { x: width * 0.85, y: height * 0.35, radius: width * 0.15, hue: 160, opacity: 0.05 },
    ];

    mountainCacheRef.current = null;
  }, []);

  const drawMountains = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const horizonY = height * 0.68;

    // Far mountains (lighter, higher)
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, horizonY + height * 0.04);
    ctx.lineTo(width * 0.05, horizonY - height * 0.08);
    ctx.lineTo(width * 0.12, horizonY + height * 0.02);
    ctx.lineTo(width * 0.2, horizonY - height * 0.14);
    ctx.lineTo(width * 0.28, horizonY - height * 0.04);
    ctx.lineTo(width * 0.36, horizonY - height * 0.18);
    ctx.lineTo(width * 0.44, horizonY - height * 0.06);
    ctx.lineTo(width * 0.52, horizonY - height * 0.22);
    ctx.lineTo(width * 0.6, horizonY - height * 0.08);
    ctx.lineTo(width * 0.68, horizonY - height * 0.19);
    ctx.lineTo(width * 0.76, horizonY - height * 0.05);
    ctx.lineTo(width * 0.84, horizonY - height * 0.16);
    ctx.lineTo(width * 0.92, horizonY - height * 0.03);
    ctx.lineTo(width, horizonY - height * 0.1);
    ctx.lineTo(width, height);
    ctx.closePath();
    const farGrad = ctx.createLinearGradient(0, horizonY - height * 0.22, 0, height);
    farGrad.addColorStop(0, "rgba(25, 20, 55, 0.85)");
    farGrad.addColorStop(0.4, "rgba(15, 12, 40, 0.92)");
    farGrad.addColorStop(1, "rgba(5, 4, 15, 1)");
    ctx.fillStyle = farGrad;
    ctx.fill();

    // Near mountains (darker, lower)
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, horizonY + height * 0.1);
    ctx.lineTo(width * 0.08, horizonY - height * 0.02);
    ctx.lineTo(width * 0.18, horizonY + height * 0.06);
    ctx.lineTo(width * 0.3, horizonY - height * 0.12);
    ctx.lineTo(width * 0.38, horizonY + height * 0.02);
    ctx.lineTo(width * 0.48, horizonY - height * 0.08);
    ctx.lineTo(width * 0.55, horizonY + height * 0.03);
    ctx.lineTo(width * 0.65, horizonY - height * 0.15);
    ctx.lineTo(width * 0.73, horizonY + height * 0.01);
    ctx.lineTo(width * 0.82, horizonY - height * 0.1);
    ctx.lineTo(width * 0.9, horizonY + height * 0.04);
    ctx.lineTo(width, horizonY - height * 0.05);
    ctx.lineTo(width, height);
    ctx.closePath();
    const nearGrad = ctx.createLinearGradient(0, horizonY - height * 0.15, 0, height);
    nearGrad.addColorStop(0, "rgba(10, 8, 25, 0.96)");
    nearGrad.addColorStop(1, "rgba(3, 2, 8, 1)");
    ctx.fillStyle = nearGrad;
    ctx.fill();

    // Foreground hills (pure black silhouette)
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, horizonY + height * 0.18);
    ctx.bezierCurveTo(width * 0.15, horizonY + height * 0.08, width * 0.25, horizonY + height * 0.15, width * 0.35, horizonY + height * 0.1);
    ctx.bezierCurveTo(width * 0.45, horizonY + height * 0.05, width * 0.55, horizonY + height * 0.12, width * 0.65, horizonY + height * 0.08);
    ctx.bezierCurveTo(width * 0.75, horizonY + height * 0.04, width * 0.88, horizonY + height * 0.14, width, horizonY + height * 0.1);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = "rgb(2, 2, 6)";
    ctx.fill();

    // Aurora glow behind mountains
    const auroraGrad = ctx.createLinearGradient(0, horizonY - height * 0.1, 0, horizonY + height * 0.05);
    auroraGrad.addColorStop(0, "rgba(0, 180, 120, 0)");
    auroraGrad.addColorStop(0.4, "rgba(0, 200, 140, 0.06)");
    auroraGrad.addColorStop(0.7, "rgba(80, 100, 255, 0.04)");
    auroraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = auroraGrad;
    ctx.fillRect(0, horizonY - height * 0.1, width, height * 0.2);

    // Snow caps on tallest peaks
    const peaks = [
      { x: width * 0.52, y: horizonY - height * 0.22 },
      { x: width * 0.2, y: horizonY - height * 0.14 },
      { x: width * 0.36, y: horizonY - height * 0.18 },
      { x: width * 0.68, y: horizonY - height * 0.19 },
      { x: width * 0.84, y: horizonY - height * 0.16 },
    ];
    peaks.forEach(peak => {
      const snowGrad = ctx.createRadialGradient(peak.x, peak.y, 0, peak.x, peak.y, width * 0.025);
      snowGrad.addColorStop(0, "rgba(220, 230, 255, 0.35)");
      snowGrad.addColorStop(0.5, "rgba(180, 200, 255, 0.12)");
      snowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = snowGrad;
      ctx.beginPath();
      ctx.ellipse(peak.x, peak.y, width * 0.025, height * 0.02, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const spawnShootingStar = useCallback((width: number, height: number) => {
    const ss = shootingStarsRef.current.find(s => !s.active);
    if (!ss) return;
    const angle = (Math.random() * 30 + 15) * Math.PI / 180;
    const speed = 8 + Math.random() * 6;
    ss.x = Math.random() * width * 0.8;
    ss.y = Math.random() * height * 0.3;
    ss.vx = Math.cos(angle) * speed;
    ss.vy = Math.sin(angle) * speed;
    ss.length = 80 + Math.random() * 120;
    ss.opacity = 1;
    ss.active = true;
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

    // Deep space sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.72);
    skyGrad.addColorStop(0, "rgb(2, 1, 10)");
    skyGrad.addColorStop(0.2, "rgb(4, 3, 18)");
    skyGrad.addColorStop(0.5, "rgb(6, 5, 25)");
    skyGrad.addColorStop(0.8, "rgb(10, 8, 32)");
    skyGrad.addColorStop(1, "rgb(15, 12, 40)");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Bottom fill
    ctx.fillStyle = "rgb(2, 2, 6)";
    ctx.fillRect(0, height * 0.72, width, height * 0.28);

    // Nebula orbs
    nebulaRef.current.forEach(orb => {
      const ng = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      ng.addColorStop(0, `hsla(${orb.hue}, 70%, 55%, ${orb.opacity})`);
      ng.addColorStop(0.5, `hsla(${orb.hue}, 60%, 40%, ${orb.opacity * 0.4})`);
      ng.addColorStop(1, `hsla(${orb.hue}, 50%, 30%, 0)`);
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.ellipse(orb.x, orb.y, orb.radius, orb.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    starsRef.current.forEach(star => {
      const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.35 + 0.65;
      const finalOpacity = star.opacity * twinkle;
      // Glow for bigger stars
      if (star.size > 1.2) {
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        glow.addColorStop(0, `rgba(${star.color}, ${finalOpacity * 0.4})`);
        glow.addColorStop(1, `rgba(${star.color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${finalOpacity})`;
      ctx.fill();
    });

    // Milky Way band
    const mwGrad = ctx.createLinearGradient(0, height * 0.05, width, height * 0.55);
    mwGrad.addColorStop(0, "rgba(80, 60, 120, 0)");
    mwGrad.addColorStop(0.2, "rgba(100, 80, 150, 0.04)");
    mwGrad.addColorStop(0.5, "rgba(120, 100, 180, 0.07)");
    mwGrad.addColorStop(0.8, "rgba(80, 60, 130, 0.04)");
    mwGrad.addColorStop(1, "rgba(60, 40, 100, 0)");
    ctx.fillStyle = mwGrad;
    ctx.fillRect(0, 0, width, height * 0.7);

    // Shooting stars
    if (t >= nextShootingStarRef.current) {
      spawnShootingStar(width, height);
      nextShootingStarRef.current = t + 120 + Math.floor(Math.random() * 200);
    }

    shootingStarsRef.current.forEach(ss => {
      if (!ss.active) return;
      const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx ** 2 + ss.vy ** 2)) * ss.length;
      const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx ** 2 + ss.vy ** 2)) * ss.length;
      const ssGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      ssGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
      ssGrad.addColorStop(1, `rgba(220, 230, 255, ${ss.opacity})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = ssGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Head glow
      const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 4);
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
      headGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.opacity -= 0.018;
      if (ss.opacity <= 0 || ss.x > width || ss.y > height) ss.active = false;
    });

    // Mountains
    drawMountains(ctx, width, height);

    // Subtle moon
    const moonX = width * 0.82, moonY = height * 0.12, moonR = Math.min(width, height) * 0.035;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 4);
    moonGlow.addColorStop(0, "rgba(220, 230, 255, 0.12)");
    moonGlow.addColorStop(0.4, "rgba(180, 200, 255, 0.05)");
    moonGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 4, 0, Math.PI * 2);
    ctx.fill();

    const moonBody = ctx.createRadialGradient(moonX - moonR * 0.2, moonY - moonR * 0.2, 0, moonX, moonY, moonR);
    moonBody.addColorStop(0, "rgba(240, 245, 255, 0.95)");
    moonBody.addColorStop(0.6, "rgba(210, 220, 255, 0.88)");
    moonBody.addColorStop(1, "rgba(180, 195, 240, 0.75)");
    ctx.fillStyle = moonBody;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    animationRef.current = requestAnimationFrame(animate);
  }, [drawMountains, spawnShootingStar]);

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
      transition={{ duration: 2.5 }}
    />
  );
}

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

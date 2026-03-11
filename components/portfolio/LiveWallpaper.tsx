"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Jet {
  x: number;
  y: number;
  speed: number;
  size: number;
  altitude: number; // y drift
  trailLength: number;
  trail: { x: number; y: number }[];
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

export function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const jetsRef = useRef<Jet[]>([]);
  const starsRef = useRef<Star[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const frameRef = useRef(0);

  const initScene = useCallback((width: number, height: number) => {
    // Stars in upper sky
    starsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Clouds at mid level
    cloudsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * width,
      y: height * 0.3 + Math.random() * height * 0.35,
      width: 180 + Math.random() * 220,
      height: 40 + Math.random() * 60,
      speed: 0.08 + Math.random() * 0.12,
      opacity: 0.04 + Math.random() * 0.08,
    }));

    // Fighter jets
    jetsRef.current = Array.from({ length: 2 }, (_, i) => ({
      x: -200 - i * 600,
      y: height * (0.2 + i * 0.15),
      speed: 1.2 + i * 0.5,
      size: 18 + i * 6,
      altitude: (Math.random() - 0.5) * 0.08,
      trailLength: 80 + i * 30,
      trail: [],
    }));
  }, []);

  const drawJet = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(220, 230, 255, 0.92)";
    ctx.strokeStyle = "rgba(180, 200, 255, 0.6)";
    ctx.lineWidth = 0.5;

    // Fuselage
    ctx.beginPath();
    ctx.moveTo(size * 2.2, 0);
    ctx.lineTo(-size * 1.2, -size * 0.22);
    ctx.lineTo(-size * 1.8, 0);
    ctx.lineTo(-size * 1.2, size * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main wings
    ctx.beginPath();
    ctx.moveTo(size * 0.2, 0);
    ctx.lineTo(-size * 0.6, -size * 1.1);
    ctx.lineTo(-size * 1.3, -size * 1.0);
    ctx.lineTo(-size * 0.8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.2, 0);
    ctx.lineTo(-size * 0.6, size * 1.1);
    ctx.lineTo(-size * 1.3, size * 1.0);
    ctx.lineTo(-size * 0.8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tail fins
    ctx.beginPath();
    ctx.moveTo(-size * 0.9, 0);
    ctx.lineTo(-size * 1.5, -size * 0.55);
    ctx.lineTo(-size * 1.8, -size * 0.45);
    ctx.lineTo(-size * 1.3, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-size * 0.9, 0);
    ctx.lineTo(-size * 1.5, size * 0.55);
    ctx.lineTo(-size * 1.8, size * 0.45);
    ctx.lineTo(-size * 1.3, 0);
    ctx.closePath();
    ctx.fill();

    // Cockpit glow
    const cockpitGrad = ctx.createRadialGradient(size * 0.8, -size * 0.05, 0, size * 0.8, -size * 0.05, size * 0.35);
    cockpitGrad.addColorStop(0, "rgba(150, 220, 255, 0.9)");
    cockpitGrad.addColorStop(1, "rgba(80, 160, 220, 0)");
    ctx.fillStyle = cockpitGrad;
    ctx.beginPath();
    ctx.ellipse(size * 0.8, -size * 0.05, size * 0.35, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.save();
    const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.width / 2);
    grad.addColorStop(0, `rgba(180, 200, 255, ${cloud.opacity})`);
    grad.addColorStop(1, `rgba(100, 140, 200, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
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

    // Sky gradient — deep space top to twilight horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "rgb(2, 4, 18)");
    skyGrad.addColorStop(0.35, "rgb(5, 10, 35)");
    skyGrad.addColorStop(0.65, "rgb(12, 25, 65)");
    skyGrad.addColorStop(0.85, "rgb(30, 55, 110)");
    skyGrad.addColorStop(1, "rgb(60, 90, 150)");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle aurora shimmer
    const auroraGrad = ctx.createLinearGradient(0, height * 0.1, width, height * 0.4);
    auroraGrad.addColorStop(0, `rgba(0, 80, 180, ${0.04 + Math.sin(t * 0.008) * 0.02})`);
    auroraGrad.addColorStop(0.5, `rgba(0, 160, 120, ${0.03 + Math.cos(t * 0.006) * 0.015})`);
    auroraGrad.addColorStop(1, `rgba(80, 0, 160, ${0.04 + Math.sin(t * 0.01) * 0.02})`);
    ctx.fillStyle = auroraGrad;
    ctx.fillRect(0, 0, width, height * 0.5);

    // Stars
    starsRef.current.forEach(star => {
      const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity * twinkle})`;
      ctx.fill();
    });

    // Clouds
    cloudsRef.current.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x - cloud.width > width) cloud.x = -cloud.width;
      drawCloud(ctx, cloud);
    });

    // Jets
    jetsRef.current.forEach(jet => {
      jet.y += Math.sin(t * jet.altitude * 10) * 0.3;
      jet.x += jet.speed;

      jet.trail.unshift({ x: jet.x, y: jet.y });
      if (jet.trail.length > jet.trailLength) jet.trail.pop();

      if (jet.x > width + 300) {
        jet.x = -300;
        jet.y = height * (0.15 + Math.random() * 0.3);
        jet.trail = [];
      }

      // Engine glow
      const glowGrad = ctx.createRadialGradient(jet.x - jet.size * 2, jet.y, 0, jet.x - jet.size * 2, jet.y, jet.size * 2.5);
      glowGrad.addColorStop(0, "rgba(255, 160, 60, 0.9)");
      glowGrad.addColorStop(0.3, "rgba(255, 80, 20, 0.5)");
      glowGrad.addColorStop(1, "rgba(255, 40, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(jet.x - jet.size * 2, jet.y, jet.size * 2.5, jet.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Contrail
      jet.trail.forEach((pt, i) => {
        const alpha = (1 - i / jet.trail.length) * 0.18;
        const trailWidth = (1 - i / jet.trail.length) * jet.size * 0.25;
        ctx.beginPath();
        ctx.arc(pt.x - jet.size * 1.8, pt.y, trailWidth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx.fill();
      });

      drawJet(ctx, jet.x, jet.y, jet.size);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [drawJet, drawCloud]);

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

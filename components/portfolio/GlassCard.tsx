"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  layoutId?: string;
  floating?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  onClick,
  layoutId,
  floating = false,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: floating ? [0, -8, 0] : 0, 
        scale: 1 
      }}
      transition={{
        duration: 0.6,
        delay,
        y: floating ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        } : undefined,
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass-card rounded-2xl p-6 cursor-pointer",
        "transition-all duration-300",
        "hover:border-white/20",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Highlight gradient on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

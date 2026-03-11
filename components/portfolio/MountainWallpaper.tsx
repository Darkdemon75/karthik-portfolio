"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function MountainWallpaper() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Fighter Plane Wallpaper Image */}
      <Image
        src="/images/fighter-wallpaper.jpg"
        alt="Fighter jet flying through dramatic sunset clouds"
        fill
        className="object-cover"
        priority
        quality={100}
      />

      {/* Subtle animated overlay for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"
        animate={{
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

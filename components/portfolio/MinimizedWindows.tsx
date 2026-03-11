"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MinimizedWindow {
  id: string;
  title: string;
  color?: string;
}

interface MinimizedWindowsProps {
  windows: MinimizedWindow[];
  onRestore: (id: string) => void;
}

export function MinimizedWindows({ windows, onRestore }: MinimizedWindowsProps) {
  return (
    <div className="fixed bottom-24 left-6 z-20 flex gap-2">
      <AnimatePresence>
        {windows.map((window, index) => (
          <motion.button
            key={window.id}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              delay: index * 0.05 
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRestore(window.id)}
            className="glass-card px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2"
          >
            <div 
              className={`w-3 h-3 rounded-full ${window.color || "bg-gradient-to-br from-primary to-accent"}`}
            />
            <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">
              {window.title}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

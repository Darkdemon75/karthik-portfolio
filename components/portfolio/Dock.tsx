"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  User,
  FolderKanban,
  Code2,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Settings,
  Terminal,
  FileText,
  Calendar,
  Image,
  Music,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

interface DockItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  action?: string;
  color: string;
  isActive?: boolean;
}

const dockItems: DockItem[] = [
  { icon: StickyNote, label: "Notes", action: "notes", color: "from-yellow-400 via-amber-500 to-orange-500" },
  { icon: User, label: "About", action: "about", color: "from-cyan-400 via-blue-500 to-blue-600" },
  { icon: FolderKanban, label: "Projects", action: "projects", color: "from-violet-400 via-purple-500 to-purple-600" },
  { icon: Code2, label: "Stack", action: "stack", color: "from-emerald-400 via-green-500 to-green-600" },
  { icon: FileText, label: "Resume", action: "resume", color: "from-amber-400 via-orange-500 to-orange-600" },
  { icon: Terminal, label: "Terminal", action: "terminal", color: "from-zinc-400 via-gray-500 to-gray-600" },
  { icon: Calendar, label: "Schedule", action: "schedule", color: "from-rose-400 via-red-500 to-red-600" },
];

const socialItems: DockItem[] = [
  { icon: Github, label: "GitHub", href: "https://github.com", color: "from-slate-400 via-slate-500 to-slate-600" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "from-blue-400 via-blue-600 to-blue-700" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com", color: "from-sky-400 via-sky-500 to-sky-600" },
  { icon: Mail, label: "Email", action: "contact", color: "from-teal-400 via-teal-500 to-teal-600" },
];

interface DockProps {
  onItemClick?: (action: string) => void;
  activeItems?: string[];
}

export function Dock({ onItemClick, activeItems = [] }: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: 0.5 
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        setHoveredItem(null);
      }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30"
    >
      <motion.div 
        className="glass-dock rounded-[22px] px-3 py-2.5 flex items-end gap-1"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Main Apps */}
        {dockItems.map((item) => (
          <DockIcon 
            key={item.label} 
            item={item} 
            mouseX={mouseX}
            isActive={activeItems.includes(item.action || "")}
            onHover={setHoveredItem}
            hoveredItem={hoveredItem}
            onClick={() => {
              if (item.href) {
                window.open(item.href, "_blank");
              } else if (onItemClick && item.action) {
                onItemClick(item.action);
              }
            }}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-12 bg-white/10 mx-2 self-center rounded-full" />

        {/* Social/Contact */}
        {socialItems.map((item) => (
          <DockIcon 
            key={item.label} 
            item={item} 
            mouseX={mouseX}
            isActive={activeItems.includes(item.action || "")}
            onHover={setHoveredItem}
            hoveredItem={hoveredItem}
            onClick={() => {
              if (item.href) {
                window.open(item.href, "_blank");
              } else if (onItemClick && item.action) {
                onItemClick(item.action);
              }
            }}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-12 bg-white/10 mx-2 self-center rounded-full" />

        {/* Settings */}
        <DockIcon
          item={{ icon: Settings, label: "Settings", action: "settings", color: "from-gray-400 via-gray-500 to-gray-600" }}
          mouseX={mouseX}
          isActive={false}
          onHover={setHoveredItem}
          hoveredItem={hoveredItem}
          onClick={() => onItemClick && onItemClick("settings")}
        />
      </motion.div>
    </motion.div>
  );
}

interface DockIconProps {
  item: DockItem;
  mouseX: any;
  isActive: boolean;
  onHover: (label: string | null) => void;
  hoveredItem: string | null;
  onClick: () => void;
}

function DockIcon({ item, mouseX, isActive, onHover, hoveredItem, onClick }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isHovered = hoveredItem === item.label;

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-200, -100, 0, 100, 200], [50, 60, 85, 60, 50]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 200,
    damping: 15,
  });

  const ySync = useTransform(distance, [-200, -100, 0, 100, 200], [0, -8, -20, -8, 0]);
  const y = useSpring(ySync, {
    mass: 0.1,
    stiffness: 200,
    damping: 15,
  });

  const Icon = item.icon;

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-12 px-3 py-1.5 rounded-lg glass text-xs font-medium text-foreground/90 whitespace-nowrap z-50 shadow-lg"
          >
            {item.label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 rotate-45 rounded-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ width, height: width, y }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        onMouseEnter={() => onHover(item.label)}
        onMouseLeave={() => onHover(null)}
        className={cn(
          "relative flex items-center justify-center rounded-[16px] cursor-pointer",
          "bg-gradient-to-br shadow-lg",
          item.color,
          "transition-all duration-150"
        )}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 rounded-[16px] overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* Icon */}
        <motion.div
          style={{
            width: useTransform(width, (w) => w * 0.45),
            height: useTransform(width, (w) => w * 0.45),
          }}
          className="text-white drop-shadow-lg relative z-10"
        >
          <Icon className="w-full h-full" strokeWidth={1.5} />
        </motion.div>

        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-[16px] border border-white/20 pointer-events-none" />
      </motion.button>

      {/* Active indicator dot */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white/80 shadow-lg shadow-white/30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

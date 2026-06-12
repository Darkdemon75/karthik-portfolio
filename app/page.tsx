"use client";

import { useState, useCallback, useEffect } from "react";
import { LiveWallpaper } from "@/components/portfolio/LiveWallpaper";
import { OceanWallpaper } from "@/components/portfolio/OceanWallpaper";
import { MenuBar } from "@/components/portfolio/MenuBar";
import { Dock } from "@/components/portfolio/Dock";
import { DraggableWindow } from "@/components/portfolio/DraggableWindow";
import { MinimizedWindows } from "@/components/portfolio/MinimizedWindows";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import {
  ProjectWindowContent,
  AboutWindowContent,
  StackWindowContent,
  ContactWindowContent,
  ResumeWindowContent,
  TerminalWindowContent,
  NotesWindowContent,
  ScheduleWindowContent,
  SettingsWindowContent,
} from "@/components/portfolio/WindowContent";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: React.ReactNode;
}

interface OpenWindow {
  id: string;
  type: "project" | "about" | "stack" | "contact" | "resume" | "terminal" | "schedule" | "settings" | "finder" | "notes";
  title: string;
  project?: Project;
  position: { x: number; y: number };
  isMinimized: boolean;
  zIndex: number;
}

export default function PortfolioPage() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [highestZ, setHighestZ] = useState(100);

  // Settings state
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [wallpaper, setWallpaper] = useState<"mountain" | "ocean">("mountain");
  const [clockFormat, setClockFormat] = useState<"12h" | "24h">("12h");
  const [cursorStyle, setCursorStyle] = useState<"default" | "dot" | "ring" | "crosshair">("default");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const getCenteredPosition = useCallback(() => {
    if (typeof window !== "undefined") {
      return {
        x: Math.max(20, (window.innerWidth - 500) / 2),
        y: Math.max(60, (window.innerHeight - 500) / 2)
      };
    }
    return { x: 200, y: 150 };
  }, []);

  const getRandomPosition = useCallback(() => {
    const baseX = 80 + Math.random() * 300;
    const baseY = 60 + Math.random() * 150;
    return { x: baseX, y: baseY };
  }, []);

  const bringToFront = useCallback((id: string) => {
    setHighestZ(prev => prev + 1);
    setOpenWindows(windows =>
      windows.map(w => w.id === id ? { ...w, zIndex: highestZ + 1 } : w)
    );
  }, [highestZ]);

  const openWindow = useCallback((type: OpenWindow["type"], title: string, project?: Project) => {
    const id = project?.id || type;
    const existingWindow = openWindows.find(w => w.id === id);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setOpenWindows(windows =>
          windows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w)
        );
        setHighestZ(prev => prev + 1);
      } else {
        bringToFront(id);
      }
      return;
    }

    setHighestZ(prev => prev + 1);
    const isNotes = type === "notes";
    const isSettings = type === "settings";
    setOpenWindows(windows => [
      ...windows,
      {
        id,
        type,
        title,
        project,
        position: isNotes || isSettings ? getCenteredPosition() : getRandomPosition(),
        isMinimized: false,
        zIndex: highestZ + 1,
      },
    ]);
  }, [openWindows, getRandomPosition, getCenteredPosition, highestZ, bringToFront]);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows(windows => windows.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setOpenWindows(windows =>
      windows.map(w => w.id === id ? { ...w, isMinimized: true } : w)
    );
  }, []);

  const minimizeAllWindows = useCallback(() => {
    setOpenWindows(windows => windows.map(w => ({ ...w, isMinimized: true })));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setHighestZ(prev => prev + 1);
    setOpenWindows(windows =>
      windows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w)
    );
  }, [highestZ]);

  const handleDockClick = useCallback((action: string) => {
    const actionMap: Record<string, { type: OpenWindow["type"]; title: string }> = {
      notes: { type: "notes", title: "Notes" },
      about: { type: "about", title: "About Me" },
      projects: { type: "project", title: "Projects" },
      stack: { type: "stack", title: "Skills Stack" },
      contact: { type: "contact", title: "Contact" },
      resume: { type: "resume", title: "Resume" },
      terminal: { type: "terminal", title: "Terminal" },
      schedule: { type: "schedule", title: "Schedule" },
      settings: { type: "settings", title: "System Preferences" },
      finder: { type: "finder", title: "Finder" },
    };
    const windowConfig = actionMap[action];
    if (windowConfig) openWindow(windowConfig.type, windowConfig.title);
  }, [openWindow]);

  const handleMenuNavigate = useCallback((section: string) => {
    if (section === "minimize-all" || section === "show-desktop") {
      minimizeAllWindows();
    } else {
      handleDockClick(section);
    }
  }, [handleDockClick, minimizeAllWindows]);

  // Wire settings icon in dock to open settings
  const handleDockClickWithSettings = useCallback((action: string) => {
    handleDockClick(action);
  }, [handleDockClick]);

  // Auto-open Notes on load
  useEffect(() => {
    const timer = setTimeout(() => openWindow("notes", "Notes"), 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "a": e.preventDefault(); openWindow("about", "About Me"); break;
          case "p": e.preventDefault(); openWindow("project", "Projects"); break;
          case "s": e.preventDefault(); openWindow("stack", "Skills Stack"); break;
          case "c": e.preventDefault(); openWindow("contact", "Contact"); break;
          case "t": e.preventDefault(); openWindow("terminal", "Terminal"); break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openWindow]);

  const minimizedWindows = openWindows.filter(w => w.isMinimized);
  const visibleWindows = openWindows.filter(w => !w.isMinimized);
  const activeWindowIds = openWindows.filter(w => !w.isMinimized).map(w => w.type);

  return (
    <main className="min-h-screen overflow-hidden">
      <CustomCursor cursorStyle={cursorStyle} />

      {/* Wallpaper */}
      {wallpaper === "mountain" ? <LiveWallpaper theme={theme} /> : <OceanWallpaper theme={theme} />}

      <MenuBar onNavigate={handleMenuNavigate} clockFormat={clockFormat} />

      {visibleWindows.map((window) => (
        <DraggableWindow
          key={window.id}
          isOpen={true}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onFocus={() => bringToFront(window.id)}
          title={window.title}
          initialPosition={window.position}
          zIndex={window.zIndex}
          layoutId={`window-${window.id}`}
        >
          {window.type === "notes" && <NotesWindowContent onNavigate={handleDockClick} />}
          {window.type === "project" && <ProjectWindowContent project={window.project} />}
          {window.type === "schedule" && <ScheduleWindowContent />}
          {window.type === "about" && <AboutWindowContent />}
          {window.type === "stack" && <StackWindowContent />}
          {window.type === "contact" && <ContactWindowContent />}
          {window.type === "resume" && <ResumeWindowContent />}
          {window.type === "terminal" && <TerminalWindowContent />}
          {window.type === "settings" && (
            <SettingsWindowContent
              theme={theme}
              wallpaper={wallpaper}
              clockFormat={clockFormat}
              cursorStyle={cursorStyle}
              onThemeChange={setTheme}
              onWallpaperChange={setWallpaper}
              onClockFormatChange={setClockFormat}
              onCursorStyleChange={setCursorStyle}
            />
          )}
        </DraggableWindow>
      ))}

      <MinimizedWindows
        windows={minimizedWindows.map(w => ({ id: w.id, title: w.title, color: w.project?.color }))}
        onRestore={restoreWindow}
      />

      <Dock
        onItemClick={handleDockClickWithSettings}
        activeItems={activeWindowIds}
      />
    </main>
  );
}

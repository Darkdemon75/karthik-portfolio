"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Apple, Wifi, Battery, Search, Volume2, Moon, Sun, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface MenuBarProps {
  onNavigate?: (section: string) => void;
  clockFormat?: "12h" | "24h";
}

const menuItems = [
  { 
    label: "Portfolio", 
    items: [
      { name: "About Me", action: "about", shortcut: "^A" },
      { name: "Projects", action: "projects", shortcut: "^P" },
      { name: "Tech Stack", action: "stack", shortcut: "^S" },
      { name: "Contact", action: "contact", shortcut: "^C" },
      { name: "divider" },
      { name: "Resume", action: "resume", shortcut: "^R" },
    ] 
  },
  { 
    label: "File", 
    items: [
      { name: "New Window", action: "finder", shortcut: "^N" },
      { name: "Open Terminal", action: "terminal", shortcut: "^T" },
      { name: "divider" },
      { name: "Download CV", action: "resume" },
    ] 
  },
  { 
    label: "View", 
    items: [
      { name: "About Me", action: "about" },
      { name: "Projects", action: "projects" },
      { name: "Tech Stack", action: "stack" },
      { name: "Contact", action: "contact" },
      { name: "divider" },
      { name: "Terminal", action: "terminal" },
    ] 
  },
  { 
    label: "Window", 
    items: [
      { name: "Minimize All", action: "minimize-all", shortcut: "^M" },
      { name: "Show Desktop", action: "show-desktop", shortcut: "^D" },
    ] 
  },
  { 
    label: "Help", 
    items: [
      { name: "Contact Me", action: "contact" },
      { name: "View Resume", action: "resume" },
      { name: "divider" },
      { name: "Open Terminal", action: "terminal" },
    ] 
  },
];

export function MenuBar({ onNavigate, clockFormat = "12h" }: MenuBarProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: clockFormat === "12h",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    // re-run when format changes — handled by effect dependency
    return () => clearInterval(interval);
  }, [clockFormat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setShowControlCenter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSpotlight && spotlightRef.current) {
      spotlightRef.current.focus();
    }
  }, [showSpotlight]);

  const handleMenuItemClick = (action: string | undefined) => {
    if (action && onNavigate) {
      onNavigate(action);
    }
    setActiveMenu(null);
  };

  const spotlightResults = [
    { name: "About Me", action: "about", icon: "person" },
    { name: "Projects", action: "projects", icon: "folder" },
    { name: "Tech Stack", action: "stack", icon: "code" },
    { name: "Contact", action: "contact", icon: "mail" },
    { name: "Resume", action: "resume", icon: "doc" },
    { name: "Terminal", action: "terminal", icon: "terminal" },
  ].filter(item => 
    spotlightQuery === "" || 
    item.name.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  return (
    <>
      <motion.header
        ref={menuRef}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`fixed top-0 inset-x-0 glass h-7 px-4 flex items-center justify-between text-[13px] select-none ${
          activeMenu || showControlCenter || showSpotlight ? "z-[200]" : "z-50"
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMenu(activeMenu === "apple" ? null : "apple")}
            className="text-foreground/90 hover:text-foreground p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <Apple className="w-4 h-4" />
          </motion.button>

          {/* Apple Menu Dropdown */}
          <AnimatePresence>
            {activeMenu === "apple" && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-8 left-2 glass-window rounded-lg py-1.5 min-w-[220px] shadow-2xl"
              >
                <div className="px-3 py-1.5 text-sm font-semibold text-foreground/90 border-b border-white/10 mb-1">
                  Karthik Devaraj
                </div>
                <button
                  onClick={() => handleMenuItemClick("about")}
                  className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors"
                >
                  About This Portfolio
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => handleMenuItemClick("settings")}
                  className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors"
                >
                  System Preferences...
                </button>
                <button
                  onClick={() => handleMenuItemClick("projects")}
                  className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors"
                >
                  App Store (Projects)
                </button>
                <button
                  onClick={() => handleMenuItemClick("stack")}
                  className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors"
                >
                  Recent Items
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => handleMenuItemClick("show-desktop")}
                  className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors"
                >
                  Sleep
                </button>
                <button
                  onClick={() => handleMenuItemClick("minimize-all")}
                  className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors"
                >
                  Restart...
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menu Items */}
          <nav className="hidden md:flex items-center">
            {menuItems.map((menu, idx) => (
              <div key={menu.label} className="relative">
                <motion.button
                  onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    activeMenu === menu.label 
                      ? "bg-white/15 text-foreground" 
                      : "text-foreground/80 hover:bg-white/10 hover:text-foreground"
                  } ${idx === 0 ? "font-semibold" : ""}`}
                >
                  {menu.label}
                </motion.button>

                <AnimatePresence>
                  {activeMenu === menu.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute top-8 left-0 glass-window rounded-lg py-1.5 min-w-[200px] shadow-2xl"
                    >
                      {menu.items.map((item, itemIdx) => (
                        item.name === "divider" ? (
                          <div key={`divider-${itemIdx}`} className="h-px bg-white/10 my-1" />
                        ) : (
                          <button
                            key={item.name}
                            onClick={() => handleMenuItemClick(item.action)}
                            className="w-full px-3 py-1.5 text-left text-foreground/80 hover:bg-primary/30 hover:text-foreground transition-colors flex items-center justify-between group"
                          >
                            <span>{item.name}</span>
                            {item.shortcut && (
                              <span className="text-[10px] text-muted-foreground group-hover:text-foreground/60 ml-4">
                                {item.shortcut}
                              </span>
                            )}
                          </button>
                        )
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>

        {/* Right Section - System Tray */}
        <div className="flex items-center gap-0.5 text-foreground/80">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors hidden sm:block"
          >
            <Volume2 className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors hidden sm:block"
          >
            <Wifi className="w-4 h-4" />
          </motion.button>
          
          {/* Battery with percentage */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
          >
            <span className="text-[11px] font-medium">{batteryLevel}%</span>
            <div className="relative w-6 h-3 rounded-sm border border-current flex items-center p-0.5">
              <div 
                className="h-full bg-current rounded-[1px] transition-all"
                style={{ width: `${batteryLevel}%` }}
              />
              <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 rounded-r-sm bg-current" />
            </div>
          </motion.div>

          {/* Control Center Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowControlCenter(!showControlCenter)}
            className={`p-1.5 rounded-md transition-colors hidden sm:block ${showControlCenter ? 'bg-white/15' : 'hover:bg-white/10'}`}
          >
            <div className="w-4 h-4 flex flex-wrap gap-0.5">
              <div className="w-1.5 h-1.5 rounded-[2px] bg-current" />
              <div className="w-1.5 h-1.5 rounded-[2px] bg-current" />
              <div className="w-1.5 h-1.5 rounded-[2px] bg-current" />
              <div className="w-1.5 h-1.5 rounded-[2px] bg-current" />
            </div>
          </motion.button>

          {/* Control Center Dropdown */}
          <AnimatePresence>
            {showControlCenter && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-9 right-20 glass-window rounded-2xl p-3 min-w-[320px] shadow-2xl"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass rounded-xl p-3 col-span-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Wi-Fi</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Portfolio Network</p>
                  </div>
                  <div className="glass rounded-xl p-3 col-span-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Focus</span>
                    </div>
                    <p className="text-xs text-muted-foreground">On</p>
                  </div>
                  <div className="glass rounded-xl p-3 col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium">Display</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="glass rounded-xl p-3 col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Sound</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spotlight Search */}
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSpotlight(!showSpotlight)}
            className={`p-1.5 rounded-md transition-colors ${showSpotlight ? 'bg-white/15' : 'hover:bg-white/10'}`}
          >
            <Search className="w-4 h-4" />
          </motion.button>

          {/* Date & Time */}
          <div className="px-2 py-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer font-medium text-foreground/90">
            <span className="hidden sm:inline">{date} </span>
            <span>{time}</span>
          </div>
        </div>
      </motion.header>

      {/* Spotlight Search Modal */}
      <AnimatePresence>
        {showSpotlight && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[190]"
              onClick={() => setShowSpotlight(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-[600px]"
            >
              <div className="glass-window rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={spotlightRef}
                    type="text"
                    value={spotlightQuery}
                    onChange={(e) => setSpotlightQuery(e.target.value)}
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                {spotlightResults.length > 0 && (
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    <p className="px-3 py-1 text-xs text-muted-foreground font-medium uppercase">Sections</p>
                    {spotlightResults.map((result) => (
                      <button
                        key={result.name}
                        onClick={() => {
                          if (onNavigate) onNavigate(result.action);
                          setShowSpotlight(false);
                          setSpotlightQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                          {result.icon === "person" && <span className="text-sm">J</span>}
                          {result.icon === "folder" && <span className="text-sm">P</span>}
                          {result.icon === "code" && <span className="text-sm">{"</>"}</span>}
                          {result.icon === "mail" && <span className="text-sm">@</span>}
                          {result.icon === "doc" && <span className="text-sm">R</span>}
                          {result.icon === "terminal" && <span className="text-sm">{">"}_</span>}
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{result.name}</p>
                          <p className="text-xs text-muted-foreground">Open {result.name.toLowerCase()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

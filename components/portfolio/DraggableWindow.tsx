"use client";

import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DraggableWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus?: () => void;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  zIndex?: number;
  layoutId?: string;
}

export function DraggableWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  title,
  children,
  initialPosition,
  zIndex = 50,
  layoutId,
}: DraggableWindowProps) {
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 });
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Constraints container */}
          <div 
            ref={constraintsRef} 
            className="fixed inset-0 pointer-events-none"
            style={{ padding: '40px 20px 120px 20px', zIndex: zIndex - 1 }}
          />
          
          <motion.div
            layoutId={layoutId}
            drag={!isMaximized}
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0.05}
            dragConstraints={constraintsRef}
            onPointerDown={onFocus}
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20,
              x: position.x,
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: isMaximized ? 20 : position.x,
              width: isMaximized ? "calc(100vw - 40px)" : "640px",
              height: isMaximized ? "calc(100vh - 160px)" : "auto",
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 35 
            }}
            className={cn(
              "fixed glass-window rounded-2xl overflow-hidden",
              "min-w-[400px] max-w-[90vw]",
              !isMaximized && "max-h-[75vh]"
            )}
            style={{
              position: 'fixed',
              top: isMaximized ? 40 : position.y,
              left: 0,
              zIndex,
            }}
            onDragEnd={(_, info) => {
              if (!isMaximized) {
                setPosition({
                  x: position.x + info.offset.x,
                  y: position.y + info.offset.y,
                });
              }
            }}
          >
            {/* Window Title Bar */}
            <motion.div
              onPointerDown={(e) => {
                if (!isMaximized) {
                  dragControls.start(e);
                }
              }}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              onDoubleClick={() => setIsMaximized(!isMaximized)}
              className="flex items-center gap-2 px-4 py-3 border-b border-white/10 cursor-move select-none bg-gradient-to-b from-white/5 to-transparent"
              style={{ touchAction: "none" }}
            >
              {/* Traffic Lights */}
              <div className="flex items-center gap-2 relative">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 flex items-center justify-center group shadow-inner"
                >
                  <X className={cn(
                    "w-2 h-2 text-[#4a0002] transition-opacity",
                    showControls ? "opacity-100" : "opacity-0"
                  )} strokeWidth={3} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize();
                  }}
                  className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 flex items-center justify-center group shadow-inner"
                >
                  <Minus className={cn(
                    "w-2 h-2 text-[#995700] transition-opacity",
                    showControls ? "opacity-100" : "opacity-0"
                  )} strokeWidth={3} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMaximized(!isMaximized);
                  }}
                  className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 flex items-center justify-center group shadow-inner"
                >
                  {isMaximized ? (
                    <Maximize2 className={cn(
                      "w-1.5 h-1.5 text-[#006500] transition-opacity",
                      showControls ? "opacity-100" : "opacity-0"
                    )} strokeWidth={3} />
                  ) : (
                    <div className={cn(
                      "w-1.5 h-1.5 flex items-center justify-center transition-opacity",
                      showControls ? "opacity-100" : "opacity-0"
                    )}>
                      <div className="w-full h-full relative">
                        <div className="absolute top-0 right-0 w-[5px] h-[5px] border border-[#006500] rounded-[1px]" />
                        <div className="absolute bottom-0 left-0 w-[5px] h-[5px] border border-[#006500] rounded-[1px] bg-[#28c840]" />
                      </div>
                    </div>
                  )}
                </motion.button>
              </div>
              
              {/* Window Title */}
              <span className="flex-1 text-center text-sm font-medium text-foreground/70 truncate px-4">
                {title}
              </span>
              
              <div className="w-[52px]" /> {/* Spacer for centering */}
            </motion.div>

            {/* Window Content */}
            <motion.div 
              className="p-6 overflow-auto scrollbar-hide"
              style={{
                maxHeight: isMaximized ? "calc(100vh - 220px)" : "calc(75vh - 60px)",
              }}
            >
              {children}
            </motion.div>

            {/* Resize Handle (bottom-right corner) */}
            {!isMaximized && (
              <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-30 hover:opacity-60 transition-opacity">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-foreground">
                  <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
                </svg>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

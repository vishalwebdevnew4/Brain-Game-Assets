import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { GameLayout } from "@/components/layout/GameLayout";
import { LevelCompletion } from "@/components/game/LevelCompletion";
import { useGameProgress, useUpdateLevel } from "@/hooks/use-game";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

// Types for level logic
type LevelStatus = "playing" | "failed" | "completed";

export default function Level() {
  const [match, params] = useRoute("/level/:id");
  const [, setLocation] = useLocation();
  const levelId = parseInt(params?.id || "1");
  const { mutate: updateLevel } = useUpdateLevel();
  const { data: user } = useGameProgress();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<LevelStatus>("playing");
  const [shake, setShake] = useState(false);
  
  // Reset state when level changes
  useEffect(() => {
    setStatus("playing");
    setShake(false);
  }, [levelId]);

  const handleComplete = () => {
    if (status !== "playing") return;
    setStatus("completed");
    
    // Play success sound if enabled
    if (user?.settings?.sound) {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbqWEyM2Kx2d+wYDIzYbPd37BgMzNisd/esWExM2Kw396xYTMzYrHf3rFhMTNisN/esWEzM2Kw396xYTEzYAAA"); // Simple ping
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }

    // Save progress
    if (user && user.maxLevel < levelId + 1) {
      updateLevel(levelId + 1);
    }
  };

  const handleFail = (message?: string) => {
    if (status !== "playing") return;
    
    // Shake effect
    setShake(true);
    setTimeout(() => setShake(false), 500);
    
    // Play fail sound
    if (user?.settings?.sound) {
      // Just a placeholder noise or vibrate
      if (navigator.vibrate) navigator.vibrate(50);
    }

    if (message) {
      toast({
        description: message,
        className: "bg-destructive text-destructive-foreground border-none font-bold text-center"
      });
    }
  };

  const handleNextLevel = () => {
    if (levelId < 10) {
      setLocation(`/level/${levelId + 1}`);
    } else {
      setLocation("/levels");
    }
  };

  const handleReset = () => {
    setStatus("playing");
    setShake(false);
    // Force re-render of level content
    window.location.reload(); 
  };

  // Render the specific level content
  const renderLevelContent = () => {
    switch (levelId) {
      case 1: return <Level1 onComplete={handleComplete} onFail={handleFail} />;
      case 2: return <Level2 onComplete={handleComplete} onFail={handleFail} />;
      case 3: return <Level3 onComplete={handleComplete} onFail={handleFail} />;
      case 4: return <Level4 onComplete={handleComplete} onFail={handleFail} />;
      case 5: return <Level5 onComplete={handleComplete} onFail={handleFail} />;
      case 6: return <Level6 onComplete={handleComplete} onFail={handleFail} />;
      case 7: return <Level7 onComplete={handleComplete} onFail={handleFail} />;
      case 8: return <Level8 onComplete={handleComplete} onFail={handleFail} />;
      case 9: return <Level9 onComplete={handleComplete} onFail={handleFail} />;
      case 10: return <Level10 onComplete={handleComplete} onFail={handleFail} />;
      default: return <div>Level not found</div>;
    }
  };

  return (
    <GameLayout level={levelId} onReset={handleReset}>
      <motion.div 
        className={`w-full h-full flex flex-col items-center justify-center p-6 ${shake ? "shake" : ""}`}
        key={levelId} // Force fresh animation on level change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {renderLevelContent()}
      </motion.div>

      {status === "completed" && (
        <LevelCompletion onNext={handleNextLevel} />
      )}
    </GameLayout>
  );
}

// ----------------------------------------------------------------------
// INDIVIDUAL LEVEL COMPONENTS
// ----------------------------------------------------------------------

// LEVEL 1: OPEN
// Goal: Drag "OPEN" text onto the door
function Level1({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  const [doorOpen, setDoorOpen] = useState(false);
  const doorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col items-center gap-16 w-full max-w-sm">
      <h2 className="text-xl font-bold font-mono tracking-widest text-muted-foreground select-none pointer-events-none">
        OPEN THE DOOR
      </h2>

      <div 
        ref={doorRef}
        className={`w-40 h-64 border-4 transition-all duration-700 relative overflow-hidden ${doorOpen ? "border-primary/20 bg-primary/5" : "border-foreground bg-card"}`}
        onClick={() => onFail()}
      >
        {/* Door knob */}
        <div className={`absolute right-4 top-1/2 w-3 h-3 rounded-full bg-foreground transition-opacity ${doorOpen ? "opacity-0" : "opacity-100"}`} />
        
        {/* Open state */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: doorOpen ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center text-primary font-bold"
        >
          OPEN
        </motion.div>
      </div>

      <motion.div 
        drag 
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={(e, info) => {
          // Check if dropped near the door (roughly -150px Y)
          if (info.offset.y < -100) {
            setDoorOpen(true);
            onComplete();
          } else {
            // Snap back happens automatically via layout animation, but we fail interaction
            // No fail call here to allow exploration, or maybe soft fail
          }
        }}
        whileHover={{ scale: 1.1, cursor: "grab" }}
        whileTap={{ scale: 0.95, cursor: "grabbing" }}
        className="px-8 py-4 bg-foreground text-background font-bold text-xl rounded-lg shadow-xl z-20"
      >
        OPEN
      </motion.div>
    </div>
  );
}

// LEVEL 2: DON'T
// Goal: Long press "DO NOT TOUCH"
function Level2({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  const [isPressing, setIsPressing] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPressing) {
      controls.start({ scale: 0.95 });
      timer = setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      controls.start({ scale: 1 });
    }
    return () => clearTimeout(timer);
  }, [isPressing, controls, onComplete]);

  const handleStart = () => setIsPressing(true);
  const handleEnd = () => {
    if (isPressing) {
      setIsPressing(false);
      setFailCount(prev => prev + 1);
      onFail(failCount > 1 ? "Time matters." : undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <motion.button
        animate={controls}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        className="w-64 h-64 rounded-full bg-destructive text-destructive-foreground font-black text-2xl tracking-tighter shadow-xl flex items-center justify-center select-none active:bg-destructive/90 touch-manipulation"
      >
        DO NOT
        <br />
        TOUCH
      </motion.button>
    </div>
  );
}

// LEVEL 3: EMPTY
// Goal: Tap the background, not the text. The text says "Tap the circle" but there is no circle.
function Level3({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
      onClick={(e) => {
        // If they click the background (container), they win
        if (e.target === e.currentTarget) {
          onComplete();
        }
      }}
    >
      <h2 
        className="text-2xl font-bold font-mono text-foreground pointer-events-auto p-8 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onFail("I said the circle.");
        }}
      >
        Tap the circle
      </h2>
      
      {/* Invisible layer to catch taps everywhere else */}
    </div>
  );
}

// LEVEL 4: DIRECTION
// Goal: Swipe DOWN when arrow points UP
function Level4({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-8 select-none">
      <div className="text-xl font-mono text-muted-foreground">Swipe UP</div>
      
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = offset.y;
          if (swipe > 50) {
            // Swiped DOWN (positive Y)
            onComplete();
          } else if (swipe < -50) {
            // Swiped UP (negative Y)
            onFail("Look closer at the arrow.");
          }
        }}
        className="p-12 bg-card border-2 border-foreground rounded-3xl cursor-grab active:cursor-grabbing shadow-lg"
      >
        {/* Arrow Pointing UP */}
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </motion.div>
    </div>
  );
}

// LEVEL 5: WAIT
// Goal: Do nothing for 5 seconds
function Level5({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, active, onComplete]);

  const handleInteraction = () => {
    if (timeLeft > 0) {
      setTimeLeft(5);
      onFail("Patience.");
    }
  };

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <h2 className="text-4xl font-black mb-8">HURRY UP</h2>
      <div className="text-6xl font-mono text-primary font-bold">
        {timeLeft}
      </div>
    </div>
  );
}

// LEVEL 6: NUMBER
// Goal: Drag the number 3 into the lock icon
function Level6({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="flex flex-col items-center gap-24">
      {/* Lock Target */}
      <div className="relative">
        <Lock className={`w-24 h-24 ${unlocked ? 'text-primary' : 'text-foreground'}`} strokeWidth={1.5} />
        {unlocked && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full"
          />
        )}
      </div>

      {/* Draggable Number */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        whileDrag={{ scale: 1.2, zIndex: 50 }}
        onDragEnd={(e, info) => {
          // If dragged up roughly 150px
          if (info.offset.y < -50) {
            setUnlocked(true);
            onComplete();
          }
        }}
        className="text-8xl font-serif font-bold cursor-grab active:cursor-grabbing select-none"
      >
        3
      </motion.div>
    </div>
  );
}

// LEVEL 7: TWO
// Goal: Pinch the circle (simulated with 2 separate touch points/clicks for desktop ease, or multi-touch)
// For web simplicity without reliable multi-touch on all devices, we can require clicking 2 buttons simultaneously
// Or using the "pointer events" API to track multiple pointers.
function Level7({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  const pointers = useRef(new Set<number>());

  const handlePointerDown = (e: React.PointerEvent) => {
    pointers.current.add(e.pointerId);
    if (pointers.current.size >= 2) {
      onComplete();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full select-none touch-none">
      <h2 className="text-xl font-mono">Use two fingers</h2>
      
      <div 
        className="w-64 h-64 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center relative active:bg-secondary/30 transition-colors"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="text-secondary-foreground font-bold opacity-50">
          PINCH ME
        </div>
      </div>
    </div>
  );
}

// LEVEL 8: TEXT
// Goal: Tap the word "button" in the sentence "Tap the button"
function Level8({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      {/* Decoy Button */}
      <button 
        className="px-12 py-6 bg-foreground text-background font-bold text-2xl rounded-sm shadow-xl active:scale-95 transition-transform"
        onClick={() => onFail("Too literal.")}
      >
        BUTTON
      </button>

      {/* The instruction with interactive word */}
      <div className="text-xl text-muted-foreground font-mono">
        Tap the <span 
          className="font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
        >button</span>
      </div>
    </div>
  );
}

// LEVEL 9: RELEASE
// Goal: Hold, fill bar, release when full
function Level9({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef<number>();

  const update = () => {
    if (holding) {
      setProgress(prev => {
        const next = prev + 1.5; // Speed
        if (next > 110) return next; // Let it overflow slightly to fail
        return next;
      });
      requestRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    if (holding) {
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      
      // Check success on release
      if (progress >= 95 && progress <= 105) {
        onComplete();
      } else if (progress > 10) {
        onFail(progress > 105 ? "Too much." : "Not enough.");
        setProgress(0);
      } else {
        setProgress(0);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [holding]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 select-none">
      <div className="w-64 h-4 bg-muted rounded-full overflow-hidden border border-border">
        <motion.div 
          className={`h-full ${progress >= 95 && progress <= 105 ? 'bg-green-500' : 'bg-foreground'}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <button
        className="w-32 h-32 rounded-full border-4 border-foreground flex items-center justify-center font-bold tracking-widest active:bg-foreground active:text-background transition-colors touch-manipulation"
        onMouseDown={() => setHolding(true)}
        onMouseUp={() => setHolding(false)}
        onTouchStart={(e) => { e.preventDefault(); setHolding(true); }}
        onTouchEnd={(e) => { e.preventDefault(); setHolding(false); }}
        onMouseLeave={() => setHolding(false)}
      >
        HOLD
      </button>
    </div>
  );
}

// LEVEL 10: MEMORY
// Goal: Same as Level 3 (Empty), remember to tap empty space
function Level10({ onComplete, onFail }: { onComplete: () => void, onFail: (m?: string) => void }) {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onComplete();
        }
      }}
    >
      {/* No text this time. Pure memory. */}
      {/* Decoy element to make them think it's different */}
      <div 
        className="w-4 h-4 rounded-full bg-foreground/20 animate-pulse pointer-events-none"
      />
    </div>
  );
}

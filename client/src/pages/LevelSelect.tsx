import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { GameLayout } from "@/components/layout/GameLayout";
import { useGameProgress } from "@/hooks/use-game";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

const TOTAL_LEVELS = 10;

export default function LevelSelect() {
  const [, setLocation] = useLocation();
  const { data: user } = useGameProgress();
  const { toast } = useToast();
  
  const currentMaxLevel = user?.maxLevel || 1;

  const handleLevelClick = (level: number) => {
    if (level <= currentMaxLevel) {
      setLocation(`/level/${level}`);
    } else {
      // Flavor text for locked levels
      toast({
        description: "Curiosity is not punished. Yet.",
        duration: 2000,
        className: "bg-background border-border text-foreground font-mono text-center",
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <GameLayout>
      <div className="w-full h-full flex flex-col p-6 pt-24 pb-32">
        <h1 className="text-3xl font-bold tracking-tighter mb-8 pl-2">SELECT LEVEL</h1>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
          >
            {Array.from({ length: TOTAL_LEVELS }).map((_, i) => {
              const level = i + 1;
              const isLocked = level > currentMaxLevel;
              
              return (
                <motion.button
                  key={level}
                  variants={item}
                  onClick={() => handleLevelClick(level)}
                  className={clsx(
                    "aspect-square rounded-2xl flex items-center justify-center text-xl font-bold transition-all relative overflow-hidden group",
                    isLocked 
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                      : "bg-card border-2 border-border shadow-sm hover:border-primary/50 hover:shadow-md hover:-translate-y-1 active:scale-95 text-foreground"
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-6 h-6 opacity-40" />
                  ) : (
                    <span>{level}</span>
                  )}
                  
                  {!isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </GameLayout>
  );
}

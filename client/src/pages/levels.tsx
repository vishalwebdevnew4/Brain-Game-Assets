import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame, TOTAL_LEVELS } from "@/lib/gameContext";

export default function LevelSelect() {
  const [, setLocation] = useLocation();
  const { coins, maxLevel, isLevelCompleted, isLevelUnlocked } = useGame();

  const levelGroups = [];
  for (let i = 0; i < TOTAL_LEVELS; i += 10) {
    levelGroups.push({
      start: i + 1,
      end: Math.min(i + 10, TOTAL_LEVELS),
      levels: Array.from({ length: Math.min(10, TOTAL_LEVELS - i) }, (_, j) => i + j + 1),
    });
  }

  return (
    <div className="min-h-screen bg-background" data-testid="levels-screen">
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/home")} data-testid="button-back">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Levels</h1>
        <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="font-bold text-foreground text-sm">{coins}</span>
        </div>
      </header>

      <main className="p-4 pb-20">
        {levelGroups.map((group) => (
          <div key={group.start} className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Levels {group.start}-{group.end}
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {group.levels.map((level) => {
                const completed = isLevelCompleted(level);
                const unlocked = isLevelUnlocked(level);
                const isCurrent = level === maxLevel;

                return (
                  <motion.button
                    key={level}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => unlocked && setLocation(`/play/${level}`)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold border-2 transition-colors
                      ${completed 
                        ? "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400" 
                        : isCurrent
                          ? "bg-primary/20 border-primary text-primary"
                          : unlocked 
                            ? "bg-card border-border text-foreground hover:border-primary" 
                            : "bg-muted border-muted text-muted-foreground cursor-not-allowed"
                      }
                    `}
                    disabled={!unlocked}
                    data-testid={`level-button-${level}`}
                  >
                    {completed ? (
                      <Check className="w-4 h-4" />
                    ) : !unlocked ? (
                      <Lock className="w-4 h-4" />
                    ) : null}
                    <span>{level}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

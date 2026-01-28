import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVEL_REWARD, TOTAL_LEVELS } from "@/lib/gameContext";

interface LevelCompleteProps {
  level: number;
  onNext: () => void;
  onHome: () => void;
}

export default function LevelComplete({ level, onNext, onHome }: LevelCompleteProps) {
  const isLastLevel = level >= TOTAL_LEVELS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      data-testid="level-complete-overlay"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-card rounded-2xl p-8 max-w-sm w-full text-center shadow-xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: 3, duration: 0.5 }}
        >
          <Sparkles className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        </motion.div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isLastLevel ? "Congratulations!" : "Level Complete!"}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          {isLastLevel 
            ? "You've completed all 100 levels!" 
            : `Level ${level} completed`
          }
        </p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 bg-yellow-500/20 rounded-full px-4 py-2 mb-6"
        >
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">+{LEVEL_REWARD}</span>
        </motion.div>

        <div className="flex flex-col gap-3">
          {!isLastLevel && (
            <Button size="lg" className="w-full" onClick={onNext} data-testid="button-next-level">
              Next Level
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
          <Button variant="outline" size="lg" className="w-full" onClick={onHome} data-testid="button-home">
            Back to Home
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

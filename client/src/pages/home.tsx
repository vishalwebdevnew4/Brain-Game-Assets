import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Settings, Coins, Play, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/gameContext";

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const { coins, maxLevel, isLoading } = useGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Brain className="w-16 h-16 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="home-screen">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border" data-testid="coin-display">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-foreground">{coins}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/settings")}
          data-testid="button-settings"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Brain className="w-32 h-32 text-primary" />
          <h1 className="text-4xl font-bold text-foreground text-center">Brain Challenge</h1>
          <p className="text-muted-foreground text-center">Test your brain with 100 tricky puzzles!</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <Button
            size="lg"
            className="w-full h-16 text-xl"
            onClick={() => setLocation(`/play/${maxLevel}`)}
            data-testid="button-continue"
          >
            <Play className="w-6 h-6 mr-2" />
            {maxLevel > 1 ? `Continue Level ${maxLevel}` : "Start Playing"}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setLocation("/levels")}
            data-testid="button-levels"
          >
            Level Select
          </Button>
        </motion.div>
      </main>

      <footer className="p-4 text-center text-muted-foreground text-sm">
        Level {maxLevel} of 100
      </footer>
    </div>
  );
}

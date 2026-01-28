import { useState, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Lightbulb, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame, HINT_COST } from "@/lib/gameContext";
import { getLevelData } from "@/lib/levels";
import LevelComplete from "@/components/game/LevelComplete";
import HintPopup from "@/components/game/HintPopup";
import PuzzleRenderer from "@/components/game/PuzzleRenderer";

export default function PlayScreen() {
  const params = useParams<{ level: string }>();
  const level = parseInt(params.level || "1", 10);
  const [, setLocation] = useLocation();
  const { coins, completeLevel, useHint, getHintsUsed, isLevelCompleted, addCoins } = useGame();
  
  const [showComplete, setShowComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [localHintsUsed, setLocalHintsUsed] = useState(getHintsUsed(level));

  const levelData = getLevelData(level);

  const handleSuccess = useCallback(async () => {
    if (!isLevelCompleted(level)) {
      await completeLevel(level);
    }
    setShowComplete(true);
  }, [level, completeLevel, isLevelCompleted]);

  const handleReset = () => {
    setResetKey((k) => k + 1);
  };

  const handleUseHint = async () => {
    const success = await useHint(level);
    if (success) {
      setHintRevealed(true);
      setLocalHintsUsed((h) => h + 1);
    }
  };

  const handleWatchAd = async () => {
    await addCoins(HINT_COST);
    setHintRevealed(true);
    setLocalHintsUsed((h) => h + 1);
  };

  const handleNextLevel = () => {
    setShowComplete(false);
    setHintRevealed(false);
    setResetKey(0);
    setLocation(`/play/${level + 1}`);
  };

  if (!levelData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Level not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="play-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/levels")} data-testid="button-back">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <h1 className="text-lg font-bold text-foreground" data-testid="level-title">
          Level {level}
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-card px-2 py-1 rounded-full border text-sm">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-foreground">{coins}</span>
          </div>
        </div>
      </header>

      <div className="p-4 bg-card/50 border-b">
        <h2 className="text-xl font-bold text-foreground text-center" data-testid="puzzle-title">
          {levelData.title}
        </h2>
        <p className="text-muted-foreground text-center mt-1" data-testid="puzzle-instruction">
          {levelData.instruction}
        </p>
      </div>

      <main className="flex-1 relative overflow-hidden">
        <PuzzleRenderer
          key={resetKey}
          level={level}
          levelData={levelData}
          onSuccess={handleSuccess}
        />
      </main>

      <footer className="flex items-center justify-around p-4 border-t bg-card">
        <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => setShowHint(true)} data-testid="button-hint">
          <Lightbulb className="w-4 h-4 mr-2" />
          Hint
        </Button>
      </footer>

      <AnimatePresence>
        {showComplete && (
          <LevelComplete
            level={level}
            onNext={handleNextLevel}
            onHome={() => setLocation("/home")}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && (
          <HintPopup
            hint={levelData.hint}
            coins={coins}
            hintsUsed={localHintsUsed}
            onUseHint={handleUseHint}
            onWatchAd={handleWatchAd}
            onClose={() => {
              setShowHint(false);
              setHintRevealed(false);
            }}
            isRevealed={hintRevealed}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

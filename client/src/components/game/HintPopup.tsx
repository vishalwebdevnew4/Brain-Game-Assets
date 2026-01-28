import { motion } from "framer-motion";
import { Lightbulb, X, Coins, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HINT_COST } from "@/lib/gameContext";

interface HintPopupProps {
  hint: string;
  coins: number;
  hintsUsed: number;
  onUseHint: () => void;
  onWatchAd: () => void;
  onClose: () => void;
  isRevealed: boolean;
}

export default function HintPopup({
  hint,
  coins,
  hintsUsed,
  onUseHint,
  onWatchAd,
  onClose,
  isRevealed,
}: HintPopupProps) {
  const canAfford = coins >= HINT_COST;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      data-testid="hint-popup"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-bold text-foreground">Hint</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-hint">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {isRevealed ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <p className="text-foreground">{hint}</p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">
              Need help? Get a hint to point you in the right direction.
            </p>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={onUseHint}
                disabled={!canAfford}
                data-testid="button-use-hint-coins"
              >
                <Coins className="w-4 h-4 mr-2" />
                Use Hint ({HINT_COST} coins)
              </Button>

              {!canAfford && (
                <p className="text-sm text-red-500 text-center">
                  Not enough coins! You have {coins} coins.
                </p>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={onWatchAd}
                data-testid="button-watch-ad"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Ad for Free Hint
              </Button>
            </div>
          </>
        )}

        {hintsUsed > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Hints used on this level: {hintsUsed}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

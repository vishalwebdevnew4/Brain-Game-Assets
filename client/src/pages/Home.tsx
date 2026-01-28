import { useState } from "react";
import { useLocation } from "wouter";
import { motion, useAnimation } from "framer-motion";
import { GameLayout } from "@/components/layout/GameLayout";

export default function Home() {
  const [, setLocation] = useLocation();
  const controls = useAnimation();
  const [tapCount, setTapCount] = useState(0);

  const handlePlayTap = async () => {
    if (tapCount === 0) {
      setTapCount(1);
      // Deceptive UI: Button dodges the first click
      await controls.start({
        x: 20,
        y: -10,
        rotate: 2,
        transition: { type: "spring", stiffness: 500, damping: 15 }
      });
    } else {
      // Second click works
      await controls.start({ scale: 0.95 });
      setTimeout(() => {
        setLocation("/levels");
      }, 200);
    }
  };

  return (
    <GameLayout>
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xs aspect-square flex items-center justify-center"
        >
          <motion.button
            animate={controls}
            onClick={handlePlayTap}
            className="w-48 h-48 rounded-full bg-foreground text-background text-2xl font-bold tracking-widest shadow-2xl hover:shadow-xl transition-shadow flex items-center justify-center border-4 border-transparent hover:border-primary/20"
          >
            PLAY
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: tapCount > 0 ? 1 : 0 }}
          className="mt-12 text-muted-foreground text-sm font-mono"
        >
          Trust nothing.
        </motion.div>
      </div>
    </GameLayout>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    if (canContinue) {
      setLocation("/home");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col items-center justify-center cursor-pointer"
      onClick={handleTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-testid="splash-screen"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Brain className="w-24 h-24 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold text-foreground">Brain Challenge</h1>
        <p className="text-muted-foreground text-lg">100 Puzzles to Test Your Mind</p>
      </motion.div>

      {canContinue && (
        <motion.p
          className="absolute bottom-20 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Tap anywhere to continue
        </motion.p>
      )}
    </motion.div>
  );
}

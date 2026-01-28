import { motion } from "framer-motion";
import { useEffect } from "react";
import { Check } from "lucide-react";

interface LevelCompletionProps {
  onNext: () => void;
}

export function LevelCompletion({ onNext }: LevelCompletionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-lg shadow-primary/10"
        >
          <Check className="w-12 h-12 text-primary" strokeWidth={3} />
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold tracking-widest uppercase text-foreground/80"
        >
          Level Complete
        </motion.h2>
      </div>
    </motion.div>
  );
}

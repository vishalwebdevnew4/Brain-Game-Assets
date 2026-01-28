import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto redirect after delay if user doesn't tap
    const timer = setTimeout(() => {
      // Optional: Auto-advance
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    setLocation("/home");
  };

  return (
    <div 
      className="w-full h-screen bg-background flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={handleTap}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          TOUCH <span className="text-primary">/</span> THINK
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-muted-foreground text-sm md:text-base font-mono"
        >
          Nothing works the way it should
        </motion.p>
      </motion.div>
    </div>
  );
}

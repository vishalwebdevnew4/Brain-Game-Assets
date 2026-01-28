import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { LevelData } from "@/lib/levels";

interface PuzzleRendererProps {
  level: number;
  levelData: LevelData;
  onSuccess: () => void;
}

export default function PuzzleRenderer({ level, levelData, onSuccess }: PuzzleRendererProps) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4" data-testid="puzzle-area">
      <PuzzleContent level={level} levelData={levelData} onSuccess={onSuccess} />
    </div>
  );
}

function PuzzleContent({ level, levelData, onSuccess }: PuzzleRendererProps) {
  switch (level) {
    case 1:
      return <Level1Puzzle onSuccess={onSuccess} />;
    case 2:
      return <Level2Puzzle onSuccess={onSuccess} />;
    case 3:
      return <Level3Puzzle onSuccess={onSuccess} />;
    case 4:
      return <Level4Puzzle onSuccess={onSuccess} />;
    case 5:
      return <Level5Puzzle onSuccess={onSuccess} />;
    case 6:
      return <Level6Puzzle onSuccess={onSuccess} />;
    case 7:
      return <Level7Puzzle onSuccess={onSuccess} />;
    case 8:
      return <Level8Puzzle onSuccess={onSuccess} />;
    case 9:
      return <Level9Puzzle onSuccess={onSuccess} />;
    case 10:
      return <Level10Puzzle onSuccess={onSuccess} />;
    default:
      return <GenericPuzzle level={level} levelData={levelData} onSuccess={onSuccess} />;
  }
}

function Level1Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [wrong, setWrong] = useState<string | null>(null);

  const handleTap = (animal: string, isCorrect: boolean) => {
    if (isCorrect) {
      onSuccess();
    } else {
      setWrong(animal);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-muted-foreground">Which is the biggest?</p>
      <div className="flex flex-wrap justify-center gap-6">
        <motion.button
          animate={wrong === "elephant" ? { x: [-5, 5, -5, 5, 0] } : {}}
          onClick={() => handleTap("elephant", false)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border hover:border-primary transition-colors"
          data-testid="tap-elephant"
        >
          <span className="text-4xl">🐘</span>
          <span className="text-sm text-foreground">Elephant</span>
        </motion.button>
        
        <motion.button
          onClick={() => handleTap("lion", true)}
          className="flex flex-col items-center gap-2 p-6 rounded-xl bg-card border hover:border-primary transition-colors"
          data-testid="tap-lion"
        >
          <span className="text-7xl">🦁</span>
          <span className="text-sm text-foreground">Lion</span>
        </motion.button>
        
        <motion.button
          animate={wrong === "mouse" ? { x: [-5, 5, -5, 5, 0] } : {}}
          onClick={() => handleTap("mouse", false)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border hover:border-primary transition-colors"
          data-testid="tap-mouse"
        >
          <span className="text-2xl">🐭</span>
          <span className="text-sm text-foreground">Mouse</span>
        </motion.button>
      </div>
    </div>
  );
}

function Level2Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [cloud1Pos, setCloud1Pos] = useState({ x: -40, y: 0 });
  const [cloud2Pos, setCloud2Pos] = useState({ x: 40, y: 0 });
  const [bloomed, setBloomed] = useState(false);

  const checkBloom = (c1: { x: number }, c2: { x: number }) => {
    if (Math.abs(c1.x) > 80 && Math.abs(c2.x) > 80 && !bloomed) {
      setBloomed(true);
      setTimeout(onSuccess, 1000);
    }
  };

  return (
    <div className="relative w-64 h-80">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl">☀️</div>
      
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -20, bottom: 20 }}
        onDrag={(_, info) => {
          const newPos = { x: cloud1Pos.x + info.delta.x, y: cloud1Pos.y };
          setCloud1Pos(newPos);
          checkBloom(newPos, cloud2Pos);
        }}
        className="absolute top-2 left-1/4 text-5xl cursor-grab active:cursor-grabbing"
        data-testid="drag-cloud1"
      >
        ☁️
      </motion.div>
      
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -20, bottom: 20 }}
        onDrag={(_, info) => {
          const newPos = { x: cloud2Pos.x + info.delta.x, y: cloud2Pos.y };
          setCloud2Pos(newPos);
          checkBloom(cloud1Pos, newPos);
        }}
        className="absolute top-2 right-1/4 text-5xl cursor-grab active:cursor-grabbing"
        data-testid="drag-cloud2"
      >
        ☁️
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={bloomed ? { scale: [1, 1.2, 1] } : {}}
          className="text-6xl"
        >
          {bloomed ? "🌸" : "🌱"}
        </motion.div>
        <div className="w-12 h-8 bg-amber-700 rounded-b-lg mx-auto" />
      </div>
    </div>
  );
}

function Level3Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [elephantInside, setElephantInside] = useState(false);
  const fridgeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-12">
      <motion.div
        ref={fridgeRef}
        onClick={() => !fridgeOpen && setFridgeOpen(true)}
        className={`relative w-24 h-40 rounded-lg cursor-pointer ${fridgeOpen ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-300 dark:bg-gray-600"}`}
        data-testid="tap-fridge"
      >
        {!fridgeOpen && (
          <div className="absolute right-2 top-1/2 w-2 h-8 bg-gray-400 rounded" />
        )}
        {fridgeOpen && (
          <div className="w-full h-full flex items-center justify-center border-4 border-blue-300 rounded-lg">
            {elephantInside && <span className="text-3xl">🐘</span>}
          </div>
        )}
        <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
          {fridgeOpen ? "Open" : "Tap to open"}
        </p>
      </motion.div>

      {!elephantInside && (
        <motion.div
          drag={fridgeOpen}
          dragConstraints={{ left: -200, right: 0, top: -50, bottom: 50 }}
          onDragEnd={(_, info) => {
            if (fridgeOpen && info.point.x < 200) {
              setElephantInside(true);
              setTimeout(onSuccess, 500);
            }
          }}
          className={`text-5xl ${fridgeOpen ? "cursor-grab active:cursor-grabbing" : ""}`}
          data-testid="drag-elephant"
        >
          🐘
        </motion.div>
      )}
    </div>
  );
}

function Level4Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [wrong, setWrong] = useState(false);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - startX.current;
    
    if (diff < -50) {
      onSuccess();
    } else if (diff > 50) {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  return (
    <motion.div
      animate={wrong ? { x: [-5, 5, -5, 5, 0] } : {}}
      className="bg-gray-900 rounded-3xl p-8 w-64"
    >
      <div className="bg-gray-800 rounded-2xl p-6 text-center">
        <p className="text-gray-400 mb-4">Slide to unlock</p>
        <div
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="bg-gray-700 rounded-full p-4 cursor-grab active:cursor-grabbing"
          data-testid="swipe-unlock"
        >
          <span className="text-2xl">→</span>
        </div>
        <p className="text-xs text-gray-500 mt-4">Swipe the arrow</p>
      </div>
    </motion.div>
  );
}

function Level5Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [slices, setSlices] = useState([
    { id: 1, visible: true, x: 0, y: 0 },
    { id: 2, visible: true, x: 10, y: 5 },
    { id: 3, visible: true, x: -10, y: 10 },
  ]);
  const [hiddenRevealed, setHiddenRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);

  const revealHidden = () => {
    if (!hiddenRevealed) {
      setHiddenRevealed(true);
    }
  };

  const checkAnswer = (num: string) => {
    setAnswer(num);
    if (num === "9") {
      onSuccess();
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setAnswer("");
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
        {slices.map((slice, i) => (
          <motion.div
            key={slice.id}
            drag
            onDrag={revealHidden}
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            className="absolute text-4xl cursor-grab"
            style={{ left: `${40 + slice.x}%`, top: `${30 + slice.y}%` }}
            data-testid={`drag-slice-${i}`}
          >
            🍕
          </motion.div>
        ))}
        {hiddenRevealed && (
          <>
            <div className="absolute text-3xl" style={{ left: "20%", top: "50%" }}>🍕</div>
            <div className="absolute text-3xl" style={{ left: "60%", top: "55%" }}>🍕</div>
            <div className="absolute text-3xl" style={{ left: "35%", top: "60%" }}>🍕</div>
            <div className="absolute text-3xl" style={{ left: "45%", top: "20%" }}>🍕</div>
            <div className="absolute text-3xl" style={{ left: "55%", top: "40%" }}>🍕</div>
            <div className="absolute text-3xl" style={{ left: "25%", top: "35%" }}>🍕</div>
          </>
        )}
      </div>
      
      <motion.div
        animate={wrong ? { x: [-5, 5, -5, 5, 0] } : {}}
        className="grid grid-cols-5 gap-2"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            onClick={() => checkAnswer(String(num))}
            className={`w-10 h-10 rounded-lg border text-lg font-bold transition-colors ${
              answer === String(num) ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
            }`}
            data-testid={`num-${num}`}
          >
            {num}
          </button>
        ))}
      </motion.div>
      {hiddenRevealed && <p className="text-sm text-muted-foreground">Count all 9 slices!</p>}
    </div>
  );
}

function Level6Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [isOn, setIsOn] = useState(true);

  const handleTap = () => {
    setIsOn(false);
    setTimeout(onSuccess, 500);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={isOn ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: isOn ? Infinity : 0, duration: 0.5 }}
        className="text-8xl"
      >
        {isOn ? "🫖" : "🫖"}
      </motion.div>
      {isOn && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-4xl"
        >
          💨
        </motion.div>
      )}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className={`px-8 py-4 rounded-xl text-xl font-bold ${
          isOn ? "bg-red-500 text-white" : "bg-gray-400 text-gray-600"
        }`}
        data-testid="tap-off-button"
      >
        {isOn ? "ON" : "OFF"}
      </motion.button>
    </div>
  );
}

function Level7Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [cookiesOnCat, setCookiesOnCat] = useState(false);
  const catTextRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-lg text-foreground">
        Feed the <span ref={catTextRef} className="font-bold text-primary underline cursor-pointer" data-testid="word-cat">cat</span> please
      </p>
      
      <div className="flex items-center gap-12">
        <div className="text-6xl">🐱</div>
        
        {!cookiesOnCat && (
          <motion.div
            drag
            dragConstraints={{ left: -150, right: 50, top: -50, bottom: 50 }}
            onDragEnd={(_, info) => {
              if (info.point.x < 200) {
                setCookiesOnCat(true);
                setTimeout(onSuccess, 500);
              }
            }}
            className="text-5xl cursor-grab active:cursor-grabbing"
            data-testid="drag-cookies"
          >
            🍪
          </motion.div>
        )}
      </div>
      
      {cookiesOnCat && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl"
        >
          😋
        </motion.div>
      )}
    </div>
  );
}

function Level8Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [merged, setMerged] = useState(false);
  const [bluePos, setBluePos] = useState({ x: 0, y: 0 });

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-muted-foreground">Find the green ball</p>
      
      <div className="flex items-center gap-8">
        {!merged ? (
          <>
            <motion.div
              drag
              dragConstraints={{ left: -20, right: 100, top: -50, bottom: 50 }}
              onDrag={(_, info) => setBluePos({ x: info.point.x, y: info.point.y })}
              onDragEnd={(_, info) => {
                if (info.point.x > 150) {
                  setMerged(true);
                  setTimeout(onSuccess, 500);
                }
              }}
              className="w-16 h-16 bg-blue-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg"
              data-testid="drag-blue-ball"
            />
            <div
              className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg"
              data-testid="yellow-ball"
            />
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500 rounded-full shadow-lg"
          />
        )}
      </div>
    </div>
  );
}

function Level9Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [wrong, setWrong] = useState<string | null>(null);

  const handleTap = (part: string, isCorrect: boolean) => {
    if (isCorrect) {
      onSuccess();
    } else {
      setWrong(part);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted-foreground">What's unusual here?</p>
      
      <div className="relative bg-card rounded-2xl p-8 border">
        <div className="text-7xl mb-4">🤡</div>
        
        <div className="flex gap-4">
          <motion.button
            animate={wrong === "hat" ? { x: [-5, 5, -5, 5, 0] } : {}}
            onClick={() => handleTap("hat", false)}
            className="px-4 py-2 bg-muted rounded-lg text-sm"
            data-testid="tap-hat"
          >
            Hat
          </motion.button>
          
          <motion.button
            onClick={() => handleTap("hand", true)}
            className="px-4 py-2 bg-muted rounded-lg text-sm"
            data-testid="tap-hand"
          >
            Hand (6 fingers)
          </motion.button>
          
          <motion.button
            animate={wrong === "nose" ? { x: [-5, 5, -5, 5, 0] } : {}}
            onClick={() => handleTap("nose", false)}
            className="px-4 py-2 bg-muted rounded-lg text-sm"
            data-testid="tap-nose"
          >
            Nose
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function Level10Puzzle({ onSuccess }: { onSuccess: () => void }) {
  const [caught, setCaught] = useState(0);
  const [apples, setApples] = useState<{ id: number; x: number; caught: boolean }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setCaught(0);
    const newApples = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      caught: false,
    }));
    setApples(newApples);
  };

  const catchApple = (id: number) => {
    setApples((prev) =>
      prev.map((a) => (a.id === id ? { ...a, caught: true } : a))
    );
    const newCaught = caught + 1;
    setCaught(newCaught);
    if (newCaught >= 5) {
      setTimeout(onSuccess, 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl font-bold text-foreground">Caught: {caught}/5</p>
      
      {!gameStarted ? (
        <button
          onClick={startGame}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-xl font-bold"
          data-testid="button-start-game"
        >
          Start!
        </button>
      ) : (
        <div className="relative w-72 h-80 bg-gradient-to-b from-blue-200 to-green-200 dark:from-blue-900 dark:to-green-900 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl">🌳</div>
          
          {apples.map((apple) => (
            !apple.caught && (
              <motion.button
                key={apple.id}
                initial={{ y: 60 }}
                animate={{ y: 280 }}
                transition={{ duration: 3 + apple.id * 0.5, ease: "linear" }}
                onClick={() => catchApple(apple.id)}
                className="absolute text-3xl"
                style={{ left: `${apple.x}%` }}
                data-testid={`apple-${apple.id}`}
              >
                🍎
              </motion.button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function GenericPuzzle({ level, levelData, onSuccess }: PuzzleRendererProps) {
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    setSolved(true);
    onSuccess();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="text-6xl">🧩</div>
      <p className="text-muted-foreground text-center max-w-xs">
        {levelData.instruction}
      </p>
      
      <div className="bg-card rounded-xl p-6 border">
        <p className="text-sm text-muted-foreground mb-4">
          Type: <span className="font-bold text-foreground">{levelData.type}</span>
        </p>
        
        <button
          onClick={handleSolve}
          disabled={solved}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50"
          data-testid="button-solve"
        >
          {solved ? "Solved!" : "Solve Puzzle"}
        </button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center max-w-xs">
        This is a placeholder for Level {level}. The full puzzle implementation would include the specific interactions described in the game design.
      </p>
    </div>
  );
}

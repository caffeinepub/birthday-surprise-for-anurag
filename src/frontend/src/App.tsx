import { useCallback, useEffect, useRef, useState } from "react";
import FinalScreen from "./components/FinalScreen";
import FloatingHearts from "./components/FloatingHearts";
import IntroScreen from "./components/IntroScreen";
import Level1Balloons from "./components/Level1Balloons";
import Level2SpinWheel from "./components/Level2SpinWheel";
import Level3Memory from "./components/Level3Memory";
import ProgressStepper from "./components/ProgressStepper";

export type GameScreen = "intro" | "level1" | "level2" | "level3" | "final";

const SCREEN_ORDER: GameScreen[] = [
  "intro",
  "level1",
  "level2",
  "level3",
  "final",
];

export function playPopSound() {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export function playSpinSound(duration = 2) {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      600,
      ctx.currentTime + duration * 0.3,
    );
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playFlipSound() {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}

export function playSuccessSound() {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch {}
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>("intro");
  const [transitioning, setTransitioning] = useState(false);

  const navigateTo = useCallback((next: GameScreen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 400);
  }, []);

  const currentStep = SCREEN_ORDER.indexOf(screen);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.98 0.012 60) 0%, oklch(0.96 0.02 350) 50%, oklch(0.97 0.015 20) 100%)",
      }}
    >
      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Main content */}
      <div
        className="relative z-10 min-h-screen flex flex-col"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {screen !== "intro" && (
          <div className="px-4 pt-4">
            <ProgressStepper currentStep={currentStep} />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {screen === "intro" && (
            <IntroScreen onStart={() => navigateTo("level1")} />
          )}
          {screen === "level1" && (
            <Level1Balloons onComplete={() => navigateTo("level2")} />
          )}
          {screen === "level2" && (
            <Level2SpinWheel onComplete={() => navigateTo("level3")} />
          )}
          {screen === "level3" && (
            <Level3Memory onComplete={() => navigateTo("final")} />
          )}
          {screen === "final" && (
            <FinalScreen onReplay={() => navigateTo("intro")} />
          )}
        </div>
      </div>
    </div>
  );
}

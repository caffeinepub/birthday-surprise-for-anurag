import { useCallback, useEffect, useRef, useState } from "react";
import { playSpinSound, playSuccessSound } from "../App";

const SEGMENTS = [
  { text: "Free hug coupon 🤗", color: "#F7A3B5" },
  { text: "1 extra kiss today 😘", color: "#E85A73" },
  { text: "You plan our next trip ✈️", color: "#D7A441" },
  { text: "Movie night pick = YOU 🎬", color: "#9B72CF" },
  { text: "Lifetime supply of my love 💛", color: "#E8845A" },
  { text: "You win… me 😌", color: "#F06A86" },
];

const REQUIRED_SPINS = 1;

interface Props {
  onComplete: () => void;
}

export default function Level2SpinWheel({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [_spinCount, setSpinCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const animRef = useRef<number>(0);
  const currentRotRef = useRef(0);

  const drawWheel = useCallback((rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;
    const segAngle = (Math.PI * 2) / SEGMENTS.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    for (const [i, seg] of SEGMENTS.entries()) {
      const startAngle = rot + i * segAngle;
      const endAngle = startAngle + segAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = `bold ${Math.min(11, canvas.width / 28)}px Figtree, sans-serif`;
      ctx.shadowBlur = 3;
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      const words = seg.text.split(" ");
      const half = Math.ceil(words.length / 2);
      const line1 = words.slice(0, half).join(" ");
      const line2 = words.slice(half).join(" ");
      ctx.fillText(line1, r - 8, -6);
      if (line2) ctx.fillText(line2, r - 8, 10);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#D7A441";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#E85A73";
    ctx.fill();
  }, []);

  useEffect(() => {
    drawWheel(0);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (spinning || completed) return;
    playSpinSound(2.5);
    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.random() * 5;
    const targetOffset = Math.random() * Math.PI * 2;
    const totalRotation = extraSpins * Math.PI * 2 + targetOffset;
    const startRot = currentRotRef.current;
    const endRot = startRot + totalRotation;
    const duration = 3000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = startRot + (endRot - startRot) * eased;
      currentRotRef.current = current;
      drawWheel(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const segAngle = (Math.PI * 2) / SEGMENTS.length;
        const normalised =
          ((current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const pointerAngle = Math.PI * 1.5;
        const adjusted =
          (pointerAngle - normalised + Math.PI * 2) % (Math.PI * 2);
        const segIndex = Math.floor(adjusted / segAngle) % SEGMENTS.length;

        setResult(SEGMENTS[segIndex].text);
        setSpinning(false);
        setSpinCount((prev) => {
          const next = prev + 1;
          if (next >= REQUIRED_SPINS) {
            playSuccessSound();
            setCompleted(true);
          }
          return next;
        });
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, completed, drawWheel]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center animate-screen px-4 py-4">
      <h2
        className="text-2xl sm:text-3xl font-black mb-1"
        style={{ color: "oklch(0.42 0.18 10)" }}
      >
        🎡 Spin the Wheel!
      </h2>
      <p
        className="text-sm font-medium mb-4"
        style={{ color: "oklch(0.6 0.06 20)" }}
      >
        Spin once to unlock the next level
      </p>

      <div
        className="relative flex-shrink-0"
        style={{ width: "min(320px, 88vw)", height: "min(320px, 88vw)" }}
      >
        <div
          className="absolute z-10"
          style={{
            top: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "28px solid oklch(0.42 0.18 10)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      <button
        type="button"
        className="btn-game mt-6 text-lg px-10 py-3"
        onClick={spin}
        disabled={spinning || completed}
        style={{ opacity: spinning || completed ? 0.6 : 1 }}
        data-ocid="wheel.primary_button"
      >
        {spinning ? "Spinning... 🌀" : "SPIN 🎡"}
      </button>

      {result && !spinning && (
        <div
          className="card-game mt-4 p-4 text-center max-w-xs w-full animate-fade-in-up"
          data-ocid="wheel.success_state"
        >
          <div className="text-3xl mb-2">🎊</div>
          <p
            className="text-base font-bold"
            style={{ color: "oklch(0.35 0.12 10)" }}
          >
            {result}
          </p>
        </div>
      )}

      {completed && (
        <div className="mt-4 text-center animate-fade-in-up">
          <p
            className="text-xl font-black mb-3"
            style={{ color: "oklch(0.42 0.18 10)" }}
          >
            🎊 You've spun the wheel!
          </p>
          <button
            type="button"
            className="btn-gold text-base px-8 py-3"
            onClick={onComplete}
            data-ocid="level2.primary_button"
          >
            Level Complete! → 💖
          </button>
        </div>
      )}
    </div>
  );
}

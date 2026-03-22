import { useCallback, useMemo, useState } from "react";
import { playPopSound, playSuccessSound } from "../App";

interface Balloon {
  id: number;
  message: string;
  color: string;
  left: string;
  top: string;
  size: number;
  animDelay: string;
  animDuration: string;
  popped: boolean;
}

const MESSAGES = [
  "Mountains were nice but watching you take care of me? 10/10 content 😏",
  "Still crushing on you baby 🥰",
  "Somewhere between all our jokes and challenges… you became my person ❤️",
  "29 looks good on you babyyyy!!!",
  "Here's to all the success, wealth, and good health coming your way… you deserve it all ❤️",
];

const BALLOON_COLORS = [
  "oklch(0.62 0.22 8)",
  "oklch(0.7 0.2 355)",
  "oklch(0.72 0.14 65)",
  "oklch(0.6 0.18 280)",
  "oklch(0.65 0.2 30)",
];

interface Props {
  onComplete: () => void;
}

export default function Level1Balloons({ onComplete }: Props) {
  const initialBalloons = useMemo<Balloon[]>(() => {
    return MESSAGES.map((msg, i) => ({
      id: i,
      message: msg,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      left: `${8 + ((i * 17) % 72)}%`,
      top: `${15 + (i % 3) * 22 + Math.floor(i / 3) * 5}%`,
      size: 70 + (i % 3) * 15,
      animDelay: `${(i * 0.7) % 3}s`,
      animDuration: `${3 + (i % 3)}s`,
      popped: false,
    }));
  }, []);

  const [balloons, setBalloons] = useState<Balloon[]>(initialBalloons);
  const [poppingId, setPoppingId] = useState<number | null>(null);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const remainingCount = balloons.filter((b) => !b.popped).length;

  const popBalloon = useCallback(
    (id: number, message: string) => {
      if (poppingId !== null) return;
      playPopSound();
      setPoppingId(id);
      setActiveMessage(message);
      setTimeout(() => {
        setBalloons((prev) =>
          prev.map((b) => (b.id === id ? { ...b, popped: true } : b)),
        );
        setPoppingId(null);
        setBalloons((prev) => {
          const remaining = prev.filter((b) => !b.popped).length;
          if (remaining === 0) {
            playSuccessSound();
            setCompleted(true);
          }
          return prev;
        });
      }, 400);
    },
    [poppingId],
  );

  const dismissMessage = useCallback(() => {
    setActiveMessage(null);
  }, []);

  return (
    <div className="flex-1 flex flex-col animate-screen">
      <div className="text-center pt-4 pb-2 px-4">
        <h2
          className="text-2xl sm:text-3xl font-black"
          style={{ color: "oklch(0.42 0.18 10)" }}
        >
          🎈 Pop the Balloons!
        </h2>
        <p
          className="text-sm font-medium mt-1"
          style={{ color: "oklch(0.6 0.06 20)" }}
        >
          Click each balloon to reveal a secret message
        </p>
        <div
          className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold"
          style={{
            background: "oklch(0.93 0.04 350)",
            color: "oklch(0.42 0.18 10)",
          }}
        >
          {remainingCount > 0
            ? `${remainingCount} balloons left 🎈`
            : "All popped! 🎉"}
        </div>
      </div>

      <div className="relative flex-1" style={{ minHeight: "60vh" }}>
        {balloons.map((balloon) => {
          const isPopping = poppingId === balloon.id;
          return (
            <button
              type="button"
              key={balloon.id}
              className="absolute cursor-pointer select-none bg-transparent border-0 p-0"
              style={{
                left: balloon.left,
                top: balloon.top,
                zIndex: 10,
              }}
              onClick={() =>
                !balloon.popped && popBalloon(balloon.id, balloon.message)
              }
              disabled={balloon.popped}
              data-ocid={`balloon.item.${balloon.id + 1}`}
            >
              {!balloon.popped && (
                <div
                  style={{
                    animation: isPopping
                      ? "popBalloon 0.4s ease-out forwards"
                      : `balloonFloat ${balloon.animDuration} ease-in-out infinite`,
                    animationDelay: isPopping ? "0s" : balloon.animDelay,
                  }}
                >
                  <div
                    style={{
                      width: balloon.size,
                      height: balloon.size * 1.15,
                      background: `radial-gradient(circle at 35% 30%, white 0%, transparent 50%), ${balloon.color}`,
                      borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
                      position: "relative",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "15%",
                        left: "22%",
                        width: "30%",
                        height: "25%",
                        background: "rgba(255,255,255,0.45)",
                        borderRadius: "50%",
                        transform: "rotate(-30deg)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 8,
                        height: 8,
                        background: balloon.color,
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <svg
                    width="2"
                    height="40"
                    aria-hidden="true"
                    style={{ display: "block", margin: "0 auto" }}
                  >
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="40"
                      stroke={balloon.color}
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {activeMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
          data-ocid="balloon.modal"
        >
          <div className="card-game p-6 max-w-xs w-full text-center animate-fade-in-up">
            <div className="text-4xl mb-3">💌</div>
            <p
              className="text-lg font-bold mb-4"
              style={{ color: "oklch(0.35 0.12 10)" }}
            >
              {activeMessage}
            </p>
            <button
              type="button"
              className="btn-game text-sm px-6 py-2"
              onClick={dismissMessage}
              data-ocid="balloon.close_button"
            >
              Aww, thanks! 💕
            </button>
          </div>
        </div>
      )}

      {completed && (
        <div className="p-6 text-center animate-fade-in-up">
          <div className="text-4xl mb-3">🎊</div>
          <p
            className="text-xl font-black mb-4"
            style={{ color: "oklch(0.42 0.18 10)" }}
          >
            All balloons popped!
          </p>
          <button
            type="button"
            className="btn-gold text-base px-8 py-3"
            onClick={onComplete}
            data-ocid="level1.primary_button"
          >
            Level Complete! → 🎡
          </button>
        </div>
      )}
    </div>
  );
}

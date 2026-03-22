import { useCallback, useState } from "react";
import { playFlipSound, playPopSound, playSuccessSound } from "../App";

const EMOJIS = ["💖", "💍", "👫", "🌹", "💌", "🦋", "🌟", "🎁"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

interface Props {
  onComplete: () => void;
}

export default function Level3Memory({ onComplete }: Props) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const flipCard = useCallback(
    (id: number) => {
      if (checking) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;
      if (flippedIds.length >= 2) return;

      playFlipSound();

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
      );

      if (newFlipped.length === 2) {
        setChecking(true);
        const [id1, id2] = newFlipped;
        const c1 = cards.find((c) => c.id === id1)!;
        const c2 = cards.find((c) => c.id === id2)!;
        const isMatch = c1.emoji === c2.emoji;

        setTimeout(() => {
          if (isMatch) {
            playPopSound();
            setCards((prev) =>
              prev.map((c) =>
                c.id === id1 || c.id === id2 ? { ...c, matched: true } : c,
              ),
            );
            setMatchCount((prev) => {
              const next = prev + 1;
              if (next === EMOJIS.length) {
                playSuccessSound();
                setCompleted(true);
              }
              return next;
            });
          } else {
            setCards((prev) =>
              prev.map((c) =>
                c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c,
              ),
            );
          }
          setFlippedIds([]);
          setChecking(false);
        }, 900);
      }
    },
    [cards, flippedIds, checking],
  );

  return (
    <div className="flex-1 flex flex-col items-center animate-screen px-3 py-4">
      <h2
        className="text-2xl sm:text-3xl font-black mb-1"
        style={{ color: "oklch(0.42 0.18 10)" }}
      >
        💖 Memory Match!
      </h2>
      <p
        className="text-sm font-medium mb-2"
        style={{ color: "oklch(0.6 0.06 20)" }}
      >
        Find all matching pairs
      </p>

      <div
        className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
        style={{
          background: "oklch(0.93 0.04 350)",
          color: "oklch(0.42 0.18 10)",
        }}
        data-ocid="memory.success_state"
      >
        {matchCount} / {EMOJIS.length} pairs matched 💖
      </div>

      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          width: "min(360px, 96vw)",
        }}
      >
        {cards.map((card, idx) => (
          <button
            type="button"
            key={card.id}
            className={`card-flip-container ${
              card.flipped || card.matched ? "flipped" : ""
            }`}
            style={{ height: "clamp(60px, 18vw, 80px)" }}
            onClick={() => flipCard(card.id)}
            data-ocid={`memory.item.${idx + 1}`}
          >
            <div className="card-flip-inner">
              <div className="card-face card-back">
                <span style={{ fontSize: "clamp(1.2rem, 4vw, 1.6rem)" }}>
                  💗
                </span>
              </div>
              <div
                className={`card-face card-front ${
                  card.matched ? "animate-match-glow" : ""
                }`}
                style={{
                  background: card.matched ? "oklch(0.95 0.06 140)" : "white",
                }}
              >
                <span style={{ fontSize: "clamp(1.4rem, 5vw, 1.8rem)" }}>
                  {card.emoji}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {completed && (
        <div className="mt-6 text-center animate-fade-in-up">
          <div className="text-4xl mb-3">🎊✨💖</div>
          <p
            className="text-xl font-black mb-4"
            style={{ color: "oklch(0.42 0.18 10)" }}
          >
            All pairs matched!
          </p>
          <button
            type="button"
            className="btn-gold text-base px-8 py-3"
            onClick={onComplete}
            data-ocid="level3.primary_button"
          >
            Level Complete! → 🎉
          </button>
        </div>
      )}
    </div>
  );
}

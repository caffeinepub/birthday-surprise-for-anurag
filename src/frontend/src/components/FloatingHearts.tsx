import { useMemo } from "react";

interface Heart {
  id: number;
  left: string;
  size: string;
  delay: string;
  duration: string;
  color: string;
}

const HEART_COLORS = [
  "oklch(0.62 0.22 8)",
  "oklch(0.72 0.18 355)",
  "oklch(0.8 0.12 350)",
  "oklch(0.72 0.14 65)",
  "oklch(0.75 0.16 5)",
];

export default function FloatingHearts() {
  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${5 + ((i * 5.5) % 90)}%`,
      size: `${0.9 + (i % 5) * 0.3}rem`,
      delay: `${(i * 1.3) % 12}s`,
      duration: `${10 + (i % 6) * 2}s`,
      color: HEART_COLORS[i % HEART_COLORS.length],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-heart"
          style={{
            left: heart.left,
            bottom: "-10%",
            fontSize: heart.size,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            opacity: 0,
            color: heart.color,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

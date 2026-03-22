import { useEffect, useRef, useState } from "react";

interface Props {
  onReplay: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = [
  "#E85A73",
  "#F06A86",
  "#D7A441",
  "#F9B9C8",
  "#9B72CF",
  "#F7A3B5",
  "#E8845A",
  "#FFFFFF",
  "#FFD700",
  "#FF6B9D",
];

function createParticle(canvasWidth: number): Particle {
  return {
    x: Math.random() * canvasWidth,
    y: -20 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 0.6 + Math.random() * 0.8,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    opacity: 0.8 + Math.random() * 0.2,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

export default function FinalScreen({ onReplay }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [envelopeHovered, setEnvelopeHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: 160 }, () =>
      createParticle(canvas.width),
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particlesRef.current.length < 200 && Math.random() < 0.3) {
        particlesRef.current.push(createParticle(canvas.width));
      }

      particlesRef.current = particlesRef.current.filter(
        (p) => p.y < canvas.height + 30,
      );

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.001;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 animate-screen">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Hero Heading */}
        <div className="text-center mb-2 animate-fade-in-up">
          <div className="text-4xl mb-3">🎉🎂🎊</div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-2">
            <span className="glitter-rose">Happy Birthday, </span>
            <span className="glitter-gold">Anurag!</span>
          </h1>
          <p
            className="text-base sm:text-lg font-semibold animate-fade-in-up"
            style={{ color: "oklch(0.52 0.1 15)", animationDelay: "0.3s" }}
          >
            You completed all levels! 🎊
          </p>
        </div>

        {/* Envelope */}
        <div className="relative flex flex-col items-center w-full mt-8">
          <p
            className="text-sm font-semibold mb-3 animate-bounce-gentle"
            style={{ color: "oklch(0.52 0.15 10)" }}
          >
            ✉️ Tap the envelope to open your letter
          </p>
          <button
            type="button"
            aria-label="Open birthday letter"
            onClick={() => setLetterOpen(true)}
            onMouseEnter={() => setEnvelopeHovered(true)}
            onMouseLeave={() => setEnvelopeHovered(false)}
            style={{
              width: "min(300px, 88vw)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "transform 0.2s ease",
              transform: envelopeHovered
                ? "scale(1.04) translateY(-4px)"
                : "scale(1)",
              filter: envelopeHovered
                ? "drop-shadow(0 12px 28px oklch(0.58 0.2 10 / 0.35))"
                : "drop-shadow(0 6px 16px oklch(0.58 0.2 10 / 0.18))",
            }}
          >
            <svg
              viewBox="0 0 300 200"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block", width: "100%" }}
            >
              <title>Birthday envelope</title>
              <rect
                x="2"
                y="60"
                width="296"
                height="138"
                rx="10"
                ry="10"
                fill="oklch(0.88 0.06 65)"
                stroke="oklch(0.72 0.14 65)"
                strokeWidth="2"
              />
              <line
                x1="2"
                y1="198"
                x2="150"
                y2="128"
                stroke="oklch(0.72 0.14 65)"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <line
                x1="298"
                y1="198"
                x2="150"
                y2="128"
                stroke="oklch(0.72 0.14 65)"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <polygon
                points="2,62 298,62 150,148"
                fill={
                  envelopeHovered ? "oklch(0.96 0.06 65)" : "oklch(0.82 0.1 65)"
                }
                stroke="oklch(0.72 0.14 65)"
                strokeWidth="2"
                style={{ transition: "fill 0.3s" }}
              />
              <text
                x="150"
                y="140"
                textAnchor="middle"
                fontSize="22"
                style={{ userSelect: "none" }}
              >
                💌
              </text>
            </svg>
          </button>
        </div>

        <div
          className="mt-8 text-center animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <button
            type="button"
            className="btn-game text-base px-8 py-3"
            onClick={onReplay}
            data-ocid="final.primary_button"
          >
            🔄 Play Again
          </button>
        </div>
      </div>

      <div
        className="relative z-10 mt-8 text-center text-xs"
        style={{ color: "oklch(0.7 0.04 20)" }}
      >
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.58 0.2 10)" }}
        >
          caffeine.ai
        </a>
      </div>

      {/* Full-screen vintage letter overlay */}
      {letterOpen && (
        <div
          className="fixed inset-0 flex items-start justify-center overflow-y-auto"
          style={{
            zIndex: 100,
            background: "oklch(0.12 0.04 20 / 0.85)",
            backdropFilter: "blur(6px)",
            animation: "fadeIn 0.35s ease both",
            padding: "1.5rem 1rem 3rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLetterOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLetterOpen(false);
          }}
          tabIndex={-1}
        >
          <div
            className="relative w-full max-w-lg"
            style={{
              /* Aged parchment paper background */
              background: "#f5e6c8",
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
                linear-gradient(135deg, #f0d9a0 0%, #f5e6c8 30%, #ede0b5 60%, #f2dfa0 100%)
              `,
              borderRadius: "4px",
              padding: "3rem 2.5rem 2.5rem",
              boxShadow:
                "0 8px 40px rgba(60,30,10,0.45), inset 0 0 60px rgba(160,100,20,0.08)",
              animation:
                "letterSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
              /* Slightly rotated for authenticity */
              transform: "rotate(-0.5deg)",
              border: "1px solid rgba(160, 120, 50, 0.3)",
            }}
          >
            {/* Vintage ruled lines */}
            <div
              style={{
                background:
                  "repeating-linear-gradient(transparent, transparent 31px, rgba(139,109,56,0.18) 31px, rgba(139,109,56,0.18) 32px)",
                position: "absolute",
                inset: "5rem 1.5rem 1.5rem",
                pointerEvents: "none",
              }}
            />

            {/* Left margin red line */}
            <div
              style={{
                position: "absolute",
                top: "5rem",
                bottom: "1.5rem",
                left: "3.5rem",
                width: "1.5px",
                background: "rgba(180,60,60,0.35)",
                pointerEvents: "none",
              }}
            />

            {/* Lip kiss stain - top right area */}
            <img
              src="/assets/generated/lip-kiss-stain-transparent.dim_300x200.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-10px",
                right: "10px",
                width: "110px",
                opacity: 0.75,
                transform: "rotate(12deg)",
                pointerEvents: "none",
                mixBlendMode: "multiply",
              }}
            />

            {/* Close button */}
            <button
              type="button"
              aria-label="Close letter"
              onClick={() => setLetterOpen(false)}
              style={{
                position: "sticky",
                top: "0.5rem",
                float: "right",
                marginBottom: "0.5rem",
                background: "rgba(160,80,60,0.15)",
                border: "1.5px solid rgba(160,80,60,0.4)",
                borderRadius: "9999px",
                width: "2.2rem",
                height: "2.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1.1rem",
                color: "#6b3a2a",
                fontWeight: 700,
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* Letter content — handwritten font */}
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "clamp(1.15rem, 3vw, 1.35rem)",
                lineHeight: "2rem",
                color: "#3a2010",
                position: "relative",
                zIndex: 5,
                paddingTop: "0.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(1.4rem, 4vw, 1.7rem)",
                  fontWeight: 700,
                  color: "#8b2020",
                  marginBottom: "1.25rem",
                }}
              >
                Happy Birthday, Anurag ❤️
              </p>

              <p style={{ marginBottom: "1rem" }}>
                It still feels a little unreal that I met you on my birthday…
                and now I'm writing this for yours. Life really said "plot
                twist" and honestly, I'm very glad it did!
              </p>

              <p style={{ marginBottom: "1rem" }}>
                In just five or six months, we've somehow lived so many versions
                of us. Long-distance calls, you going to the US, everyday
                conversations, random jokes… and of course our iconic Kasol
                trip. Matlab trip ka plan kuch aur tha, reality kuch aur hi
                nikal aayi (🤒) But I think that told us a lot about each other.
                You taking care of me so patiently, and me proving that I can
                sleep at levels that are… not humanly normal 😂
              </p>

              <p style={{ marginBottom: "1rem" }}>
                I really love how kind and caring you are. The way you show up,
                the way you make things feel easy, and how safe I feel with you.
              </p>

              <p style={{ marginBottom: "1rem" }}>
                What I love about us is how we're similar where it matters, and
                different where it keeps things interesting. It just fits. I
                know things are moving a little fast, and talking about the
                future still makes us a bit awkward and giggly… but somewhere it
                feels right. I hope it feels the same for you too.
              </p>

              <p style={{ marginBottom: "1rem" }}>
                I'm really grateful for you. For the comfort, the conversations,
                the laughter, and even our awkward moments. I like talking to
                you every day. I like having you in my life. And I'm really fond
                of you… as a person and as mine ❤️
              </p>

              <p style={{ marginBottom: "1rem" }}>
                Wishing you all the success, wealth, happiness, and good health
                as you turn 29. You deserve the best of everything.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                And selfishly… I hope I get to be a part of all of it 😌💛
              </p>

              <p style={{ fontStyle: "italic", color: "#6b3a2a" }}>
                With love,
                <br />
                <span
                  style={{
                    fontSize: "clamp(1.5rem, 4.5vw, 1.9rem)",
                    fontWeight: 700,
                  }}
                >
                  Divyanshi
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12 animate-screen">
      {/* Decorative circles */}
      <div
        className="absolute top-10 right-8 w-32 h-32 rounded-full opacity-10"
        style={{ background: "oklch(0.72 0.14 65)" }}
      />
      <div
        className="absolute bottom-20 left-6 w-24 h-24 rounded-full opacity-10"
        style={{ background: "oklch(0.62 0.22 8)" }}
      />

      <div className="text-center max-w-md relative z-10">
        <div className="text-5xl mb-6 animate-bounce-gentle">🎂🎉🎈</div>

        <h1
          className="text-3xl sm:text-4xl font-black mb-4 leading-tight"
          style={{ color: "oklch(0.42 0.18 10)" }}
        >
          A Very Serious Birthday Game 🧐
        </h1>

        <p
          className="text-lg sm:text-xl font-semibold mb-1 animate-fade-in-up"
          style={{ color: "oklch(0.52 0.1 15)", animationDelay: "0.15s" }}
        >
          Highly important tasks ahead.
        </p>
        <p
          className="text-base sm:text-lg font-medium mb-10 animate-fade-in-up"
          style={{ color: "oklch(0.58 0.08 20)", animationDelay: "0.25s" }}
        >
          Failure is not an option (it is, but still) 😌
        </p>

        <div
          className="card-game p-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "oklch(0.55 0.06 20)" }}
          >
            3 fun levels await you:
          </p>
          <div className="flex justify-around text-center">
            {[
              { icon: "🎈", name: "Pop Balloons" },
              { icon: "🎡", name: "Spin Wheel" },
              { icon: "💖", name: "Memory Match" },
            ].map((l) => (
              <div key={l.name} className="flex flex-col items-center gap-1">
                <div className="text-2xl">{l.icon}</div>
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.6 0.06 20)" }}
                >
                  {l.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="btn-game animate-pulse-glow text-lg px-10 py-4 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
          onClick={onStart}
          data-ocid="intro.primary_button"
        >
          🎮 START GAME
        </button>
      </div>
    </div>
  );
}

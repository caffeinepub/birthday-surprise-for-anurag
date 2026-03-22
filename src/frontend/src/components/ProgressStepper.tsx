interface Props {
  currentStep: number;
}

const STEPS = [
  { icon: "🎈", label: "Level 1" },
  { icon: "🎡", label: "Level 2" },
  { icon: "💖", label: "Level 3" },
  { icon: "🎉", label: "Final" },
];

export default function ProgressStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-2 max-w-sm mx-auto">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isComplete = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={step.label} className="flex items-center">
            <div
              className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${
                isActive ? "scale-110" : ""
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isComplete
                    ? "step-complete"
                    : isActive
                      ? "step-active shadow-lg"
                      : "step-pending"
                }`}
              >
                {isComplete ? "✓" : step.icon}
              </div>
              <span
                className="text-xs font-semibold hidden sm:block"
                style={{
                  color: isActive
                    ? "oklch(0.58 0.2 10)"
                    : isComplete
                      ? "oklch(0.45 0.18 140)"
                      : "oklch(0.6 0.04 20)",
                }}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className="w-6 sm:w-10 h-0.5 mx-1 rounded transition-all duration-500"
                style={{
                  background:
                    stepNum < currentStep
                      ? "oklch(0.65 0.18 140)"
                      : "oklch(0.88 0.05 350)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

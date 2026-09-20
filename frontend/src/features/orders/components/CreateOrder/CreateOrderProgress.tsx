"use client";

interface CreateOrderProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  "Address",
  "Services",
  "Turnaround",
  "Pickup Date",
  "Pickup Slot",
  "Preferences",
  "Review",
];

export default function CreateOrderProgress({
  currentStep,
  totalSteps,
}: CreateOrderProgressProps) {
  const safeCurrentStep = Math.min(
    Math.max(currentStep, 1),
    totalSteps,
  );

  const progress =
    totalSteps > 0
      ? (safeCurrentStep / totalSteps) * 100
      : 0;

  const currentStepLabel =
    steps[safeCurrentStep - 1] ?? "Order";

  return (
    <div className="w-full">
      {/* Step information */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Step {safeCurrentStep} of {totalSteps}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Complete each step to continue
          </p>
        </div>

        <p className="text-sm font-semibold text-blue-600">
          {currentStepLabel}
        </p>
      </div>

      {/* Main progress bar */}
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={safeCurrentStep}
        aria-label={`Order creation progress: step ${safeCurrentStep} of ${totalSteps}`}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Desktop step indicators */}
      <div className="mt-5 hidden grid-cols-7 gap-2 md:grid">
        {steps.map((label, index) => {
          const stepNumber = index + 1;

          const isCompleted =
            stepNumber < safeCurrentStep;

          const isCurrent =
            stepNumber === safeCurrentStep;

          const isUpcoming =
            stepNumber > safeCurrentStep;

          return (
            <div
              key={label}
              className="min-w-0"
            >
              {/* Step indicator */}
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCompleted || isCurrent
                    ? "bg-blue-600"
                    : "bg-slate-200"
                }`}
              />

              {/* Step label */}
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : isCurrent
                        ? "border-2 border-blue-600 bg-white text-blue-600"
                        : "border border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </span>

                <p
                  className={`truncate text-xs ${
                    isCurrent
                      ? "font-semibold text-slate-900"
                      : isCompleted
                        ? "font-medium text-slate-600"
                        : isUpcoming
                          ? "text-slate-400"
                          : "text-slate-400"
                  }`}
                >
                  {label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

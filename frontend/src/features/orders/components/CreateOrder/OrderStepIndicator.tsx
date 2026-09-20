"use client";

import {
  Check,
  MapPin,
  ShoppingBag,
  Clock3,
  CalendarDays,
  Timer,
  SlidersHorizontal,
  ClipboardCheck,
} from "lucide-react";

interface OrderStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

interface Step {
  number: number;
  label: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    number: 1,
    label: "Address",
    icon: MapPin,
  },
  {
    number: 2,
    label: "Services",
    icon: ShoppingBag,
  },
  {
    number: 3,
    label: "Turnaround",
    icon: Clock3,
  },
  {
    number: 4,
    label: "Pickup Date",
    icon: CalendarDays,
  },
  {
    number: 5,
    label: "Pickup Slot",
    icon: Timer,
  },
  {
    number: 6,
    label: "Preferences",
    icon: SlidersHorizontal,
  },
  {
    number: 7,
    label: "Review",
    icon: ClipboardCheck,
  },
];

export default function OrderStepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: OrderStepIndicatorProps) {
  const visibleSteps = steps.slice(0, totalSteps);

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="flex items-start">
          {visibleSteps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            const Icon = step.icon;

            const canClick =
              Boolean(onStepClick) &&
              step.number < currentStep;

            return (
              <div
                key={step.number}
                className="flex min-w-0 flex-1 items-start"
              >
                {/* Step */}
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <button
                    type="button"
                    disabled={!canClick}
                    onClick={() => {
                      if (canClick) {
                        onStepClick?.(step.number);
                      }
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      isCompleted
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCurrent
                          ? "border-blue-600 bg-white text-blue-600 ring-4 ring-blue-50"
                          : "border-slate-300 bg-white text-slate-400"
                    } ${
                      canClick
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-default"
                    }`}
                    aria-current={
                      isCurrent ? "step" : undefined
                    }
                    aria-label={`${step.label}, step ${step.number}`}
                  >
                    {isCompleted ? (
                      <Check size={18} strokeWidth={2.5} />
                    ) : (
                      <Icon size={17} strokeWidth={2} />
                    )}
                  </button>

                  <p
                    className={`mt-2 text-center text-xs ${
                      isCurrent
                        ? "font-semibold text-slate-900"
                        : isCompleted
                          ? "font-medium text-slate-600"
                          : isUpcoming
                            ? "text-slate-400"
                            : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Connector */}
                {index < visibleSteps.length - 1 && (
                  <div className="mt-5 h-0.5 flex-1 bg-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-blue-600"
                          : "bg-slate-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(() => {
              const current = visibleSteps[currentStep - 1];

              if (!current) return null;

              const Icon = current.icon;

              return (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Icon size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Current step
                    </p>

                    <p className="text-sm font-semibold text-slate-900">
                      {current.label}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          <p className="text-sm font-semibold text-blue-600">
            {currentStep} / {totalSteps}
          </p>
        </div>

        {/* Mobile progress */}
        <div className="mt-4 flex gap-1.5">
          {visibleSteps.map((step) => {
            const isCompleted =
              step.number < currentStep;

            const isCurrent =
              step.number === currentStep;

            return (
              <div
                key={step.number}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  isCompleted || isCurrent
                    ? "bg-blue-600"
                    : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

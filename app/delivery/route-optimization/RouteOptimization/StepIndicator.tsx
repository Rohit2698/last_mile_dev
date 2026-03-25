import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEP_LABELS, TOTAL_STEPS } from "./util"
import { WizardStep } from "./type"

interface StepIndicatorProps {
  currentStep: WizardStep
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center gap-0 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => {
        const isCompleted = step < currentStep
        const isActive = step === currentStep

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isActive &&
                    "border-primary text-primary bg-primary/10",
                  !isCompleted &&
                    !isActive &&
                    "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {isCompleted ? <Check size={14} /> : step}
              </div>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isActive && "text-primary",
                  isCompleted && "text-foreground",
                  !isCompleted && !isActive && "text-muted-foreground",
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {step < TOTAL_STEPS && (
              <div
                className={cn(
                  "flex-1 h-px mx-3",
                  step < currentStep ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default StepIndicator

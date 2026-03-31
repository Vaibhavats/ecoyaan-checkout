"use client";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Address" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Confirm" },
];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 16px 8px",
      width: "100%",
      background: "#FFFFFF",
    }}>
      {steps.map((step, i) => {
        const isDone = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 600, flexShrink: 0,
              background: isDone ? "#2D6A4F" : isActive ? "#1B4332" : "#FFFFFF",
              color: isDone || isActive ? "#FFFFFF" : "#9CA3AF",
              border: isDone ? "2px solid #2D6A4F" : isActive ? "2px solid #1B4332" : "2px solid #E8E3D8",
              boxShadow: isActive ? "0 0 0 4px rgba(45,106,79,0.15)" : "none",
            }}>
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span style={{
              fontSize: "11px", fontWeight: isActive ? 700 : 500,
              marginLeft: "6px", whiteSpace: "nowrap",
              color: isActive ? "#1B4332" : isDone ? "#40916C" : "#9CA3AF",
            }}>
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div style={{
                width: "28px", height: "2px",
                background: isDone ? "#52B788" : "#E8E3D8",
                margin: "0 6px", borderRadius: "2px", flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

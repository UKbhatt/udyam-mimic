// components/StepProgressBar.jsx
import { memo, useMemo, Fragment } from "react";
import {toast} from "react-toastify" ; 
import { motion } from "framer-motion";

function StepProgressBar({ step = 1, steps = ["Aadhaar", "OTP", "PAN", "Submit"] }) {
  // stable data + clamped step
  const STEPS = useMemo(() => steps, [steps]);
  const clamped = Math.max(1, Math.min(STEPS.length, Number(step) || 1));
  const cols = STEPS.length * 2 - 1; // odd=circles, even=connectors

  return (
    <div className="w-full mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
      {/* Row 1: circles + connectors */}
      <div
        className="grid items-center gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {STEPS.map((label, i) => {
          const current = i + 1;
          const active = clamped >= current;
          const nextActive = clamped >= current + 1;
          const circleCol = i * 2 + 1;
          const connectorCol = i * 2 + 2;

          return (
            <Fragment key={label}>
              {/* Circle (always has a base bg) */}
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: active ? "#1F6AE5" : "#e5e7eb",
                  color: active ? "#ffffff" : "#374151",
                  scale: active ? 1 : 0.98,
                }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 rounded-full grid place-items-center text-sm font-semibold justify-self-center bg-gray-200"
                style={{ gridColumn: `${circleCol} / span 1` }}
                aria-current={active ? "step" : undefined}
              >
                {current}
              </motion.div>

              {/* Connector (with base bg so it never disappears) */}
              {current < STEPS.length && (
                <motion.div
                  initial={false}
                  animate={{ backgroundColor: nextActive ? "#1F6AE5" : "#e5e7eb" }}
                  transition={{ duration: 0.25 }}
                  className="h-1 rounded bg-gray-200"
                  style={{ gridColumn: `${connectorCol} / span 1` }}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Row 2: labels under each circle */}
      <div
        className="grid mt-2 gap-2 text-[11px] sm:text-xs text-gray-700"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {STEPS.map((label, i) => {
          const circleCol = i * 2 + 1;
          return (
            <div
              key={label}
              className="w-12 justify-self-center text-center truncate"
              style={{ gridColumn: `${circleCol} / span 1` }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(StepProgressBar);

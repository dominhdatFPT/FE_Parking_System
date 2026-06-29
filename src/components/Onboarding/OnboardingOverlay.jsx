import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../contexts/OnboardingContext';
import OnboardingTooltip from './OnboardingTooltip';

export default function OnboardingOverlay() {
  const { isActive, currentStep, steps, targetRect } = useOnboarding();
  const step = steps[currentStep];

  // Dynamically apply class to highlight the targeted sidebar element
  useEffect(() => {
    if (!isActive || !step || step.type !== 'highlight') {
      document.querySelectorAll('.onboarding-highlighted').forEach((el) => {
        el.classList.remove('onboarding-highlighted');
      });
      return;
    }

    const targetEl = document.getElementById(step.targetId);

    // Remove class from any other elements that might have it
    document.querySelectorAll('.onboarding-highlighted').forEach((el) => {
      if (el !== targetEl) {
        el.classList.remove('onboarding-highlighted');
      }
    });

    if (targetEl) {
      targetEl.classList.add('onboarding-highlighted');
    }

    return () => {
      if (targetEl) {
        targetEl.classList.remove('onboarding-highlighted');
      }
    };
  }, [isActive, currentStep, step]);

  if (!isActive) return null;

  const isHighlight = step?.type === 'highlight';
  const padding = 6; // Padding around the highlighted component

  return (
    <>
      {/* Background overlay blocker to capture clicks and prevent interactions outside the guide */}
      <div className="fixed inset-0 z-[9996] bg-slate-950/40 backdrop-blur-[1.5px] pointer-events-auto" />

      {/* Spotlight cutout container */}
      <AnimatePresence>
        {isHighlight && targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9997] pointer-events-none"
          >
            <motion.div
              initial={false}
              animate={{
                x: targetRect.left - padding,
                y: targetRect.top - padding,
                width: targetRect.width + padding * 2,
                height: targetRect.height + padding * 2,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className={`fixed rounded-xl pointer-events-none border-2 transition-all ${
                step.pulse ? 'onboarding-pulse-glow' : 'onboarding-standard-glow'
              }`}
              style={{
                // Enormous box-shadow creates the dimming overlay, while keeping the center clear
                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55), 0 0 15px rgba(14, 165, 233, 0.45)',
                borderColor: 'rgba(14, 165, 233, 0.65)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Tooltip Container */}
      <OnboardingTooltip />
    </>
  );
}

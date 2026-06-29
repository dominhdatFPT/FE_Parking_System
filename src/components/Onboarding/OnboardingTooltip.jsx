import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../contexts/OnboardingContext';

export default function OnboardingTooltip() {
  const {
    isActive,
    currentStep,
    steps,
    targetRect,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
  } = useOnboarding();

  const tooltipRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrow: 'none' });

  const step = steps[currentStep];

  useEffect(() => {
    if (!isActive || !step) return;

    // For center popups (welcome & completion), we don't position relative to element
    if (step.type !== 'highlight' || !targetRect) {
      setCoords({ top: 0, left: 0, arrow: 'none' });
      return;
    }

    const updatePosition = () => {
      const tooltipEl = tooltipRef.current;
      const tooltipWidth = tooltipEl ? tooltipEl.offsetWidth : 320;
      const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 180;
      const padding = 16; // spacing from spotlight border

      let top = 0;
      let left = 0;
      let arrow = 'arrow-left';

      const spaceRight = window.innerWidth - targetRect.right;
      const spaceLeft = targetRect.left;
      const spaceBottom = window.innerHeight - targetRect.bottom;
      const spaceTop = targetRect.top;

      // Desktop/tablet: target is in left sidebar, so place to the right
      if (spaceRight >= tooltipWidth + padding) {
        left = targetRect.right + padding;
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        arrow = 'arrow-left';

        // Boundary adjustments
        if (top < padding) top = padding;
        if (top + tooltipHeight > window.innerHeight - padding) {
          top = window.innerHeight - tooltipHeight - padding;
        }
      }
      // Mobile: sidebar is open covering the left side. Tooltip is shown below or above
      else if (spaceBottom >= tooltipHeight + padding) {
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        top = targetRect.bottom + padding;
        arrow = 'arrow-top';

        if (left < padding) left = padding;
        if (left + tooltipWidth > window.innerWidth - padding) {
          left = window.innerWidth - tooltipWidth - padding;
        }
      } else if (spaceTop >= tooltipHeight + padding) {
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        top = targetRect.top - tooltipHeight - padding;
        arrow = 'arrow-bottom';

        if (left < padding) left = padding;
        if (left + tooltipWidth > window.innerWidth - padding) {
          left = window.innerWidth - tooltipWidth - padding;
        }
      } else if (spaceLeft >= tooltipWidth + padding) {
        left = targetRect.left - tooltipWidth - padding;
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        arrow = 'arrow-right';

        if (top < padding) top = padding;
        if (top + tooltipHeight > window.innerHeight - padding) {
          top = window.innerHeight - tooltipHeight - padding;
        }
      } else {
        // Absolute fallback center
        left = (window.innerWidth - tooltipWidth) / 2;
        top = (window.innerHeight - tooltipHeight) / 2;
        arrow = 'none';
      }

      setCoords({ top, left, arrow });
    };

    updatePosition();
    const timer = setTimeout(updatePosition, 100);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isActive, currentStep, step, targetRect]);

  if (!isActive || !step) return null;

  const isHighlight = step.type === 'highlight';

  // Variants for fade+slide animation
  const tooltipVariants = {
    hidden: { opacity: 0, y: isHighlight ? 10 : 25, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, y: isHighlight ? -10 : -25, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!isHighlight ? (
          // Center Modal Layout (Welcome & Completion)
          <motion.div
            key={`modal-${currentStep}`}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-auto w-full max-w-[480px] mx-4 rounded-3xl border border-white/20 bg-white/95 p-8 text-left shadow-2xl backdrop-blur-xl md:p-10"
          >
            {step.type === 'welcome' ? (
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-2xl shadow-inner">
                    🚗
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-800">
                      Smart Parking System
                    </h3>
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-0.5">Hướng dẫn nhanh</p>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-700 mb-3">
                  Chào mừng bạn đến với hệ thống! 👋
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Để trải nghiệm các dịch vụ gửi xe thông minh được trọn vẹn và thuận tiện nhất, hãy dành 1 phút khám phá nhanh các tính năng cốt lõi:
                </p>

                {/* Bento feature list */}
                <div className="space-y-3.5 mb-8">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 transition-colors hover:bg-slate-100/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                      <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">Trang tổng quan thông minh</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Theo dõi bãi xe gần nhất, xe đang gửi trong bãi và xem vé xe điện tử (mã QR) ra vào cổng tiện lợi.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 transition-colors hover:bg-slate-100/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                      <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">Đăng ký thẻ xe & biểu phí</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Đăng ký thẻ tháng cho phương tiện của bạn và xem bảng giá các loại thẻ dễ dàng.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 transition-colors hover:bg-slate-100/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-700">Thanh toán hóa đơn trực tuyến</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Xem chi tiết các hóa đơn gửi xe và thanh toán nhanh chóng bằng ví điện tử hoặc cổng QR.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={skipOnboarding}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-700 cursor-pointer active:scale-[0.98]"
                  >
                    Bỏ qua & Sử dụng
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-sky-200/50 transition-all hover:-translate-y-0.5 hover:shadow-sky-300/60 hover:brightness-105 active:translate-y-0 cursor-pointer active:scale-[0.98]"
                  >
                    Xem hướng dẫn (1 phút)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-inner animate-bounce">
                  🎉
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  {step.content}
                </p>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={completeOnboarding}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 hover:shadow-emerald-200 hover:brightness-105 active:translate-y-0 cursor-pointer active:scale-[0.98]"
                  >
                    Bắt đầu sử dụng ngay
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Floating Tooltip Layout
          <motion.div
            key={`tooltip-${currentStep}`}
            ref={tooltipRef}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: '320px',
            }}
            className="pointer-events-auto rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-md"
          >
            {/* Pointer arrow */}
            {coords.arrow !== 'none' && (
              <div 
                className={`onboarding-arrow-square onboarding-arrow-${coords.arrow}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              />
            )}

            <div>
              {/* Header with Title and Progress */}
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500 shadow-inner">
                  <span className="material-symbols-outlined text-[16px]">{step.icon || 'help'}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
              </div>

              {/* Guide Content */}
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500 whitespace-pre-line">
                {step.content}
              </p>

              {/* Footer with actions */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100/60 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={skipOnboarding}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Bỏ qua
                  </button>
                  {/* Progress Indicator Dots */}
                  <div className="flex gap-1">
                    {steps.filter(s => s.type === 'highlight').map((s, idx) => {
                      const highlightIdx = currentStep - 1;
                      const isActive = idx === highlightIdx;
                      return (
                        <span 
                          key={idx} 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            isActive ? 'w-3.5 bg-sky-500' : 'w-1 bg-slate-200'
                          }`} 
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      Quay lại
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-lg bg-[#0EA5E9] px-3 py-1.5 text-[11px] font-bold !text-white shadow-md shadow-sky-100 hover:bg-[#0284c7] hover:shadow-sky-200 active:bg-sky-700 transition-all cursor-pointer"
                  >
                    {currentStep === steps.length - 2 ? 'Hoàn thành' : 'Tiếp theo'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

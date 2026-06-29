import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const OnboardingContext = createContext(null);

export const ONBOARDING_STEPS = [
  {
    type: 'welcome',
    icon: 'waving_hand',
    title: '👋 Chào mừng đến với Parking Management System',
    content: 'Chúng tôi sẽ hướng dẫn bạn làm quen với hệ thống chỉ trong khoảng 1 phút.',
  },
  {
    type: 'highlight',
    targetId: 'sidebar-dashboard',
    icon: 'dashboard',
    title: 'Trang Tổng quan',
    content: 'Đây là trang Tổng quan. Bạn có thể xem các thông tin quan trọng như bãi xe gần nhất, lịch sử hoạt động và các thông báo mới.',
    progress: '1/5',
  },
  {
    type: 'highlight',
    targetId: 'sidebar-registerVehicle',
    icon: 'assignment_ind',
    title: 'Đăng ký thẻ xe',
    content: 'Đây là bước đầu tiên để sử dụng dịch vụ gửi xe. Hãy đăng ký thẻ xe trước khi bắt đầu sử dụng hệ thống.',
    pulse: true,
    progress: '2/5',
  },
  {
    type: 'highlight',
    targetId: 'sidebar-vehiclePricing',
    icon: 'sell',
    title: 'Biểu phí thẻ xe',
    content: 'Tại đây bạn có thể xem các loại thẻ và biểu phí trước khi đăng ký.',
    progress: '3/5',
  },
  {
    type: 'highlight',
    targetId: 'sidebar-payments',
    icon: 'payments',
    title: 'Thanh toán',
    content: 'Mọi hóa đơn và lịch sử thanh toán của bạn sẽ được quản lý tại đây.',
    progress: '4/5',
  },
  {
    type: 'highlight',
    targetId: 'sidebar-notifications',
    icon: 'notifications',
    title: 'Thông báo',
    content: 'Các thông báo quan trọng như cập nhật hệ thống, nhắc gia hạn thẻ hoặc thông báo thanh toán sẽ xuất hiện tại đây.',
    progress: '5/5',
  },
  {
    type: 'completion',
    icon: 'celebration',
    title: '🎉 Bạn đã sẵn sàng!',
    content: 'Chúc bạn có trải nghiệm thuận tiện cùng Parking Management System.',
  }
];

export function OnboardingProvider({ children }) {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const getStorageKey = useCallback(() => {
    const identifier = user?.email || user?.id || 'guest';
    return `parking-onboarding-completed-${identifier}`;
  }, [user]);

  // Start the onboarding manually or programmatically
  const startOnboarding = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  // Complete the onboarding (save state)
  const completeOnboarding = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    try {
      localStorage.setItem(getStorageKey(), 'true');
    } catch (e) {
      console.error('Failed to save onboarding completion state:', e);
    }
  }, [getStorageKey]);

  // Skip the onboarding (close and save state so it does not show again)
  const skipOnboarding = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    try {
      localStorage.setItem(getStorageKey(), 'true');
    } catch (e) {
      console.error('Failed to save onboarding completion state:', e);
    }
  }, [getStorageKey]);

  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep, completeOnboarding]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Auto-start on first login for driver role
  useEffect(() => {
    if (user && user.role?.toLowerCase() === 'driver') {
      const isCompleted = localStorage.getItem(getStorageKey());
      if (!isCompleted) {
        // Run with a slight delay to ensure UI is settled
        const timer = setTimeout(() => {
          startOnboarding();
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsActive(false);
    }
  }, [user, getStorageKey, startOnboarding]);

  // Update bounding rect for highlighted targets
  useEffect(() => {
    if (!isActive) {
      setTargetRect(null);
      return;
    }

    const step = ONBOARDING_STEPS[currentStep];
    if (!step || step.type !== 'highlight') {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
        });

        // Ensure highlighted element is visible in scroll container
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    
    // Periodically re-check rect (useful for dynamic sidebar layout changes or animations)
    const checkInterval = setInterval(updateRect, 300);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, currentStep]);

  // Keyboard navigation listener
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        skipOnboarding();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const step = ONBOARDING_STEPS[currentStep];
        if (step.type === 'welcome' || step.type === 'highlight') {
          nextStep();
        } else if (step.type === 'completion') {
          completeOnboarding();
        }
      } else if (e.key === 'ArrowLeft') {
        const step = ONBOARDING_STEPS[currentStep];
        if (step.type === 'highlight') {
          prevStep();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStep, nextStep, prevStep, skipOnboarding, completeOnboarding]);

  // Sidebar is forced open on mobile/tablet if we are highlighting sidebar items
  const isSidebarForcedOpen = isActive && ONBOARDING_STEPS[currentStep]?.type === 'highlight';

  const value = {
    isActive,
    currentStep,
    steps: ONBOARDING_STEPS,
    targetRect,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    nextStep,
    prevStep,
    isSidebarForcedOpen,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

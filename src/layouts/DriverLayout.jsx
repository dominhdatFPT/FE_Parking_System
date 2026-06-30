import { useState } from 'react';
import { Outlet } from 'react-router';
import DriverHeader from '../features/driver/components/DriverHeader';
import DriverSidebar from '../features/driver/components/DriverSidebar';
import AiChatWidget from '../components/AiChatWidget';
export default function DriverLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(232,121,249,0.18),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.24),transparent_55%),linear-gradient(135deg,#f8fafc_0%,#dbeafe_45%,#f3e8ff_100%)] text-[#0F172A]">
      {/* Decorative Top-Right Dots Grid */}
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-48 w-48 opacity-[0.35]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2" className="fill-indigo-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Decorative Bottom-Left Waves */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-64 w-64 opacity-[0.40]" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <path d="M-20,180 C40,160 80,190 120,140 C160,90 130,50 210,20" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
          <path d="M-40,160 C20,140 60,170 100,120 C140,70 110,30 190,0" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-60,140 C0,120 40,150 80,100 C120,50 90,10 170,-20" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 6" />
        </svg>
      </div>

      <DriverSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <DriverHeader onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-7">
            <Outlet />
          </div>
        </main>
      </div>
      <AiChatWidget />
    </div>
  );
}

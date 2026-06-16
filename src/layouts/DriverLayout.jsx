import { useState } from 'react';
import { Outlet } from 'react-router';
import DriverHeader from '../features/driver/components/DriverHeader';
import DriverSidebar from '../features/driver/components/DriverSidebar';
import { VehicleCardPricingModal } from '../features/driver/components';

export default function DriverLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <DriverSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onShowPricing={() => setPricingOpen(true)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DriverHeader onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <VehicleCardPricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  );
}

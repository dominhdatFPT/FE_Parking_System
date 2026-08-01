import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import VehicleEntryPage from '../VehicleEntryPage';
import StaffVehicleExit from '../../features/staff/pages/StaffVehicleExit';

const MODES = {
  ENTRY: 'entry',
  EXIT: 'exit',
};

function getMode(search) {
  const params = new URLSearchParams(search);
  return params.get('mode') === MODES.EXIT ? MODES.EXIT : MODES.ENTRY;
}

export default function VehicleFlowPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useMemo(() => getMode(location.search), [location.search]);

  function changeMode(nextMode) {
    const params = new URLSearchParams(location.search);
    params.set('mode', nextMode);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }

  const tabs = [
    { key: MODES.ENTRY, label: 'Xe vào', icon: ArrowDownToLine },
    { key: MODES.EXIT, label: 'Xe ra', icon: ArrowUpFromLine },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = mode === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => changeMode(tab.key)}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition ${
                  active
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {mode === MODES.EXIT ? <StaffVehicleExit /> : <VehicleEntryPage />}
      </div>
    </div>
  );
}

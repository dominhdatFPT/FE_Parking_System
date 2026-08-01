import { useMemo } from 'react';
import { useLocation } from 'react-router';
import VehicleEntryPage from '../VehicleEntryPage';
import StaffVehicleExit from '../../features/staff/pages/StaffVehicleExit';

const MODES = {
  ENTRY: 'entry',
  EXIT: 'exit',
};

function getMode(search) {
  const params = new window.URLSearchParams(search);
  return params.get('mode') === MODES.EXIT ? MODES.EXIT : MODES.ENTRY;
}

export default function VehicleFlowPage() {
  const location = useLocation();
  const mode = useMemo(() => getMode(location.search), [location.search]);

  return mode === MODES.EXIT ? <StaffVehicleExit /> : <VehicleEntryPage />;
}

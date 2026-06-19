import { useCallback, useEffect, useMemo, useState } from 'react';
import { getParkingSlots } from '../services/parkingSlotService';

const AVAILABLE_STATUS = 'AVAILABLE';

function getFriendlyError(err) {
  const message = err?.response?.data?.message;
  if (typeof message === 'string' && (message.includes('JDBC') || message.includes('SQL') || message.includes('parking_slots'))) {
    return 'DB chưa có bảng parking_slots nên chưa thể tải dữ liệu chỗ đỗ.';
  }
  return message || 'Có lỗi xảy ra khi tải dữ liệu bãi xe.';
}

function buildFloorOccupancy(slots) {
  const grouped = slots.reduce((acc, slot) => {
    const floorKey = slot.floor ?? 'unknown';
    if (!acc[floorKey]) {
      acc[floorKey] = {
        floor: floorKey,
        total: 0,
        occupied: 0,
      };
    }

    acc[floorKey].total += 1;
    if (slot.status !== AVAILABLE_STATUS) {
      acc[floorKey].occupied += 1;
    }

    return acc;
  }, {});

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      percent: item.total > 0 ? Math.round((item.occupied / item.total) * 100) : 0,
    }))
    .sort((a, b) => Number(a.floor) - Number(b.floor));
}

export const useParkingSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getParkingSlots();
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const floorOccupancy = useMemo(() => buildFloorOccupancy(slots), [slots]);

  return {
    slots,
    floorOccupancy,
    loading,
    error,
    refetch: fetchSlots,
  };
};

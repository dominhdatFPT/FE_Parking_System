import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CarFront,
  CheckCircle2,
  CircleParking,
  Filter,
  Layers3,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { getStaffParkingOperations, updateStaffParkingSlot } from '../../../services/staffService';
import { parkingAreaSummaryService } from '../../../services/parkingAreaSummaryService';

const AREA_KEYS = ['A', 'B', 'C', 'D'];

const statusConfig = {
  AVAILABLE: {
    label: 'Available',
    dot: 'bg-emerald-500',
    tile: 'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  OCCUPIED: {
    label: 'Occupied',
    dot: 'bg-rose-500',
    tile: 'bg-rose-50 text-rose-700 ring-rose-200 hover:bg-rose-100',
    badge: 'bg-rose-100 text-rose-700',
  },
  RESERVED: {
    label: 'Reserved',
    dot: 'bg-amber-500',
    tile: 'bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100',
    badge: 'bg-amber-100 text-amber-700',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    dot: 'bg-slate-400',
    tile: 'bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200',
    badge: 'bg-slate-200 text-slate-700',
  },
};

const statusOptions = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('vi-VN');

const getFacilityName = (slot) =>
  slot.facilityName ||
  slot.parkingName ||
  slot.buildingName ||
  slot.locationName ||
  'Long Khánh';

const getFloorNumber = (slot) => Number(slot.floorNumber ?? slot.floor ?? 1) || 1;

const getAreaKey = (slot, index = 0) => {
  const source = `${slot.zoneName || slot.areaName || slot.slotNumber || ''}`.toUpperCase();
  const match = source.match(/\b([ABCD])\b|[-_\s]([ABCD])\d|^([ABCD])\d/);
  return match?.[1] || match?.[2] || match?.[3] || AREA_KEYS[index % AREA_KEYS.length];
};

const getSlotLabel = (slot) => slot.slotNumber || `S-${slot.id || '-'}`;

const getAreaStatus = (area) => {
  if (area.total === 0) return { label: 'Available', className: 'bg-emerald-100 text-emerald-700' };
  if (area.maintenance === area.total) return { label: 'Maintenance', className: 'bg-slate-200 text-slate-700' };
  if (area.available === 0) return { label: 'Full', className: 'bg-rose-100 text-rose-700' };
  if (area.fillRate >= 80) return { label: 'Almost Full', className: 'bg-amber-100 text-amber-700' };
  return { label: 'Available', className: 'bg-emerald-100 text-emerald-700' };
};

function StatPill({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={19} strokeWidth={2.3} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AreaCard({ area, active, onClick }) {
  const status = getAreaStatus(area);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        active ? 'border-sky-300 ring-4 ring-sky-100' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Khu {area.key}</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Zone {area.key}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${status.className}`}>{status.label}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">Sức chứa</p>
          <p className="mt-1 text-lg font-black text-slate-950">{formatNumber(area.total)}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400">Hiện tại</p>
          <p className="mt-1 text-lg font-black text-slate-950">{formatNumber(area.current)}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400">Còn trống</p>
          <p className="mt-1 text-lg font-black text-emerald-700">{formatNumber(area.available)}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-500">
          <span>Occupancy</span>
          <span>{area.fillRate}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${area.fillRate >= 95 ? 'bg-rose-500' : area.fillRate >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${area.fillRate}%` }}
          />
        </div>
      </div>
    </button>
  );
}

function SlotDetail({ slot, updating, onMarkMaintenance }) {
  if (!slot) {
    return (
      <aside className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <CircleParking className="mx-auto text-slate-300" size={42} />
        <h3 className="mt-4 font-black text-slate-950">Chọn một slot</h3>
        <p className="mt-2 text-sm font-medium text-slate-500">Click vào ô slot để xem trạng thái và thao tác vận hành.</p>
      </aside>
    );
  }

  const config = statusConfig[slot.status] || statusConfig.AVAILABLE;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Slot detail</p>
          <h3 className="mt-1 text-2xl font-black text-slate-950">{getSlotLabel(slot)}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${config.badge}`}>{config.label}</span>
      </div>

      <dl className="mt-6 grid gap-3 text-sm">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <dt className="font-bold text-slate-500">Cơ sở</dt>
          <dd className="font-black text-slate-950">{getFacilityName(slot)}</dd>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <dt className="font-bold text-slate-500">Tầng</dt>
          <dd className="font-black text-slate-950">Tầng {getFloorNumber(slot)}</dd>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <dt className="font-bold text-slate-500">Khu</dt>
          <dd className="font-black text-slate-950">Khu {slot.areaKey}</dd>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <dt className="font-bold text-slate-500">Cập nhật</dt>
          <dd className="font-black text-slate-950">{slot.updatedAt ? new Date(slot.updatedAt).toLocaleString('vi-VN') : 'Realtime'}</dd>
        </div>
      </dl>

      <button
        type="button"
        disabled={updating || slot.status === 'MAINTENANCE'}
        onClick={() => onMarkMaintenance(slot)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        <Wrench size={17} />
        {updating ? 'Updating...' : slot.status === 'MAINTENANCE' ? 'Already Maintenance' : 'Mark Maintenance'}
      </button>
    </aside>
  );
}

export default function StaffDashboard() {
  const [slots, setSlots] = useState([]);
  const [operationOptions, setOperationOptions] = useState({ facilities: [], floors: [] });
  const [parkingOptions, setParkingOptions] = useState([]);
  const [summaryAreas, setSummaryAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedArea, setSelectedArea] = useState('A');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [updatingSlotId, setUpdatingSlotId] = useState(null);

  const fetchSlots = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [data, options] = await Promise.all([
        getStaffParkingOperations(),
        parkingAreaSummaryService.getOptions(),
      ]);
      const decorated = (data.slots || []).map((slot, index) => ({
        ...slot,
        status: slot.status || 'AVAILABLE',
        areaKey: slot.areaKey || getAreaKey(slot, index),
      }));
      setSlots(decorated);
      setParkingOptions(Array.isArray(options.buildings) ? options.buildings : []);
      setOperationOptions({
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        floors: Array.isArray(data.floors) ? data.floors : [],
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể tải dữ liệu slot.');
      setSlots([]);
      setParkingOptions([]);
      setOperationOptions({ facilities: [], floors: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const facilities = useMemo(() => {
    const optionFacilities = parkingOptions
      .map((facility) => ({
        id: String(facility.parkingId ?? facility.code),
        name: facility.name,
        code: facility.code,
      }))
      .filter((facility) => facility.id && facility.name);
    if (optionFacilities.length) {
      return optionFacilities;
    }

    const names = operationOptions.facilities
      .map((facility) => ({ id: String(facility.id ?? facility.name), name: facility.name, code: facility.code }))
      .filter((facility) => facility.id && facility.name);
    if (!names.length) {
      return [{ id: 'default', name: 'Long Khanh' }];
    }
    return names.length ? names : ['Long Khánh'];
  }, [operationOptions.facilities, parkingOptions]);

  useEffect(() => {
    if (!selectedFacilityId && facilities.length) {
      setSelectedFacilityId(facilities[0].id);
    }
  }, [facilities, selectedFacilityId]);

  const facilitySlots = useMemo(
    () => slots.filter((slot) => String(slot.facilityId ?? getFacilityName(slot)) === selectedFacilityId || !selectedFacilityId),
    [slots, selectedFacilityId],
  );

  const floorOptions = useMemo(() => {
    const selectedBuilding = parkingOptions.find((facility) => String(facility.parkingId ?? facility.code) === selectedFacilityId);
    const optionFloors = (selectedBuilding?.floors || [])
      .map((floorNumber) => ({
        floorNumber: Number(floorNumber),
        floorName: `Tầng ${floorNumber}`,
      }))
      .filter((floor) => Number.isFinite(floor.floorNumber));
    const apiFloors = operationOptions.floors
      .filter((floor) => !selectedFacilityId || String(floor.facilityId ?? floor.facilityName) === selectedFacilityId)
      .map((floor) => ({
        floorNumber: Number(floor.floorNumber),
        floorName: floor.floorName || `Tầng ${floor.floorNumber}`,
      }))
      .filter((floor) => Number.isFinite(floor.floorNumber));
    const fallbackFloors = Array.from(new Set(facilitySlots.map(getFloorNumber))).map((floorNumber) => ({
      floorNumber,
      floorName: `Tầng ${floorNumber}`,
    }));
    const byNumber = new Map();

    [...optionFloors, ...apiFloors, ...fallbackFloors].forEach((floor) => {
      if (!byNumber.has(floor.floorNumber)) {
        byNumber.set(floor.floorNumber, floor);
      }
    });

    return Array.from(byNumber.values()).sort((a, b) => a.floorNumber - b.floorNumber);
  }, [facilitySlots, operationOptions.floors, parkingOptions, selectedFacilityId]);

  const floors = useMemo(() => {
    const values = floorOptions.map((floor) => floor.floorNumber);
    return values.length ? values : [1];
  }, [floorOptions]);

  useEffect(() => {
    if (!selectedFloor && floors.length) {
      setSelectedFloor(String(floors[0]));
    }
    if (selectedFloor && !floors.includes(Number(selectedFloor))) {
      setSelectedFloor(String(floors[0]));
    }
  }, [floors, selectedFloor]);

  const floorSlots = useMemo(
    () => facilitySlots.filter((slot) => getFloorNumber(slot) === Number(selectedFloor || floors[0])),
    [facilitySlots, floors, selectedFloor],
  );

  const areas = useMemo(() => {
    return AREA_KEYS.map((key) => {
      const areaSlots = floorSlots.filter((slot) => slot.areaKey === key);
      const occupied = areaSlots.filter((slot) => slot.status === 'OCCUPIED' || slot.status === 'RESERVED').length;
      const maintenance = areaSlots.filter((slot) => slot.status === 'MAINTENANCE').length;
      const available = areaSlots.filter((slot) => slot.status === 'AVAILABLE').length;
      const fillRate = areaSlots.length ? Math.round(((occupied + maintenance) / areaSlots.length) * 100) : 0;

      return {
        key,
        slots: areaSlots,
        total: areaSlots.length,
        current: occupied,
        available,
        maintenance,
        fillRate,
      };
    });
  }, [floorSlots]);

  const selectedAreaData = areas.find((area) => area.key === selectedArea) || areas[0];

  const selectedBuildingCode = useMemo(() => {
    return facilities.find((facility) => facility.id === selectedFacilityId)?.code || '';
  }, [facilities, selectedFacilityId]);

  useEffect(() => {
    let active = true;

    const fetchAreaSummary = async () => {
      if (!selectedBuildingCode || !selectedFloor) {
        setSummaryAreas([]);
        return;
      }

      const data = await parkingAreaSummaryService.getAreas({
        buildingCode: selectedBuildingCode,
        floorNumber: Number(selectedFloor),
      });

      if (active) {
        setSummaryAreas(Array.isArray(data) ? data : []);
      }
    };

    fetchAreaSummary();

    return () => {
      active = false;
    };
  }, [selectedBuildingCode, selectedFloor]);

  const displayAreas = useMemo(() => {
    return AREA_KEYS.map((key) => {
      const slotArea = areas.find((area) => area.key === key) || {
        key,
        slots: [],
        total: 0,
        current: 0,
        available: 0,
        maintenance: 0,
        fillRate: 0,
      };
      const summaryArea = summaryAreas.find((area) => area.areaCode === key);

      if (!summaryArea) {
        return slotArea;
      }

      return {
        ...slotArea,
        total: Number(summaryArea.capacity || 0),
        current: Number(summaryArea.currentVehicleCount || 0),
        available: Number(summaryArea.availableCount || 0),
        maintenance: Number(summaryArea.maintenanceCount || 0),
        fillRate: Number(summaryArea.occupancyPercent || 0),
      };
    });
  }, [areas, summaryAreas]);

  const displaySummary = useMemo(() => {
    const total = displayAreas.reduce((sum, area) => sum + area.total, 0);
    const occupied = displayAreas.reduce((sum, area) => sum + area.current, 0);
    const available = displayAreas.reduce((sum, area) => sum + area.available, 0);
    const maintenance = displayAreas.reduce((sum, area) => sum + area.maintenance, 0);

    return {
      total,
      occupied,
      available,
      maintenance,
      fillRate: total ? Math.round(((occupied + maintenance) / total) * 100) : 0,
    };
  }, [displayAreas]);

  useEffect(() => {
    if (selectedAreaData?.total === 0) {
      const firstWithSlots = areas.find((area) => area.total > 0);
      if (firstWithSlots) {
        setSelectedArea(firstWithSlots.key);
      }
    }
  }, [areas, selectedAreaData]);

  const visibleSlots = useMemo(() => {
    const areaSlots = selectedAreaData?.slots || [];
    return statusFilter === 'ALL' ? areaSlots : areaSlots.filter((slot) => slot.status === statusFilter);
  }, [selectedAreaData, statusFilter]);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) || visibleSlots[0] || null,
    [slots, selectedSlotId, visibleSlots],
  );

  const handleMarkMaintenance = async (slot) => {
    if (!slot?.id) return;

    const nextSlot = { ...slot, status: 'MAINTENANCE' };
    setUpdatingSlotId(slot.id);
    setMessage('');

    try {
      const updated = await updateStaffParkingSlot(nextSlot);
      setSlots((current) =>
        current.map((item) =>
          item.id === slot.id ? { ...item, ...updated, status: 'MAINTENANCE', areaKey: item.areaKey } : item,
        ),
      );
      setMessage(`Đã đánh dấu ${getSlotLabel(slot)} bảo trì.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thể cập nhật trạng thái slot.');
    } finally {
      setUpdatingSlotId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-600">Parking Operations</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Vận hành bãi xe realtime</h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
            Chọn cơ sở, tầng và khu để theo dõi sức chứa, trạng thái slot và xử lý bảo trì ngay trên sơ đồ vận hành.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSlots}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.5fr_1fr] lg:items-end">
          <label className="grid gap-2 text-sm font-black text-slate-700">
            <span className="inline-flex items-center gap-2">
              <Building2 size={16} />
              Chọn cơ sở
            </span>
            <select
              value={selectedFacilityId}
              onChange={(event) => {
                setSelectedFacilityId(event.target.value);
                setSelectedSlotId(null);
              }}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>{facility.name}</option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-black text-slate-700">
              <Layers3 size={16} />
              Chọn tầng
            </p>
            <div className="flex flex-wrap gap-2">
              {floors.map((floor) => (
                <button
                  type="button"
                  key={floor}
                  onClick={() => {
                    setSelectedFloor(String(floor));
                    setSelectedSlotId(null);
                  }}
                  className={`inline-flex h-12 min-w-[112px] items-center justify-center rounded-xl border px-4 text-sm font-black shadow-sm transition ${
                    Number(selectedFloor) === floor
                      ? 'border-sky-300 bg-sky-100 text-sky-700 shadow-sky-100 ring-4 ring-sky-50'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  Tầng {floor}
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-black text-slate-700">
            <span className="inline-flex items-center gap-2">
              <Filter size={16} />
              Filter slot
            </span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setSelectedSlotId(null);
              }}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatPill icon={CircleParking} label="Tổng sức chứa" value={formatNumber(displaySummary.total)} tone="bg-sky-50 text-sky-700" />
        <StatPill icon={CarFront} label="Xe hiện tại" value={formatNumber(displaySummary.occupied)} tone="bg-rose-50 text-rose-700" />
        <StatPill icon={CheckCircle2} label="Slot còn trống" value={formatNumber(displaySummary.available)} tone="bg-emerald-50 text-emerald-700" />
        <StatPill icon={Wrench} label="Bảo trì" value={formatNumber(displaySummary.maintenance)} tone="bg-slate-100 text-slate-700" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayAreas.map((area) => (
          <AreaCard
            key={area.key}
            area={area}
            active={selectedArea === area.key}
            onClick={() => {
              setSelectedArea(area.key);
              setSelectedSlotId(null);
            }}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Sơ đồ slot - Khu {selectedArea}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {formatNumber(visibleSlots.length)} slot hiển thị theo bộ lọc hiện tại.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-black text-slate-500">
              {Object.entries(statusConfig).map(([status, config]) => (
                <span key={status} className="inline-flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                  {config.label}
                </span>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-6 grid min-h-[360px] place-items-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-500">
              Đang tải sơ đồ slot...
            </div>
          ) : visibleSlots.length === 0 ? (
            <div className="mt-6 grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm font-bold text-slate-500">
              Không có slot phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-10">
              {visibleSlots.map((slot) => {
                const config = statusConfig[slot.status] || statusConfig.AVAILABLE;
                const active = selectedSlot?.id === slot.id;

                return (
                  <button
                    key={slot.id || getSlotLabel(slot)}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`aspect-square rounded-xl p-2 text-center text-xs font-black ring-1 transition ${config.tile} ${
                      active ? 'scale-[1.03] ring-4 ring-sky-200' : ''
                    }`}
                    title={`${getSlotLabel(slot)} - ${config.label}`}
                  >
                    <span className="flex h-full items-center justify-center break-all leading-tight">{getSlotLabel(slot)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SlotDetail
            slot={selectedSlot}
            updating={updatingSlotId === selectedSlot?.id}
            onMarkMaintenance={handleMarkMaintenance}
          />

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
              <div>
                <h3 className="font-black text-amber-900">Operational note</h3>
                <p className="mt-1 text-sm font-semibold text-amber-800">
                  Khi đánh dấu bảo trì, slot sẽ không nên được cấp cho booking mới cho đến khi được mở lại từ cấu hình hệ thống.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

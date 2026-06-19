import React, { useState, useEffect } from 'react';
import { parkingMapService } from '../../services/parkingMapService';

const ParkingMapDashboard = ({ parkingId = 1 }) => {
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch parking structure
  useEffect(() => {
    fetchParkingMap();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchParkingMap, 10000);
    return () => clearInterval(interval);
  }, [parkingId]);

  const fetchParkingMap = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parkingMapService.getParkingMap(parkingId);
      setFloors(data);
      if (data.length > 0) {
        setSelectedFloor(data[0].id);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu bãi đỗ xe');
      console.error('Error fetching parking map:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'OCCUPIED':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'RESERVED':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'MAINTENANCE':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  // Get status label in Vietnamese
  const getStatusLabel = (status) => {
    const labels = {
      AVAILABLE: 'Trống',
      OCCUPIED: 'Đã đỗ',
      RESERVED: 'Đặt trước',
      MAINTENANCE: 'Bảo trì',
    };
    return labels[status] || status;
  };

  // Get status stats
  const getFloorStats = (floor) => {
    const stats = {
      total: 0,
      available: 0,
      occupied: 0,
      reserved: 0,
      maintenance: 0,
    };

    floor.slots.forEach((slot) => {
      stats.total++;
      if (slot.status === 'AVAILABLE') stats.available++;
      else if (slot.status === 'OCCUPIED') stats.occupied++;
      else if (slot.status === 'RESERVED') stats.reserved++;
      else if (slot.status === 'MAINTENANCE') stats.maintenance++;
    });

    return stats;
  };

  // Filter slots based on selected status
  const getFilteredSlots = (slots) => {
    if (selectedStatus === 'ALL') return slots;
    return slots.filter((slot) => slot.status === selectedStatus);
  };

  const currentFloor = floors.find((f) => f.id === selectedFloor);
  const stats = currentFloor ? getFloorStats(currentFloor) : null;
  const filteredSlots = currentFloor ? getFilteredSlots(currentFloor.slots) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchParkingMap}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Sơ đồ bãi xe thông minh
          </h1>
        </div>

        {/* Dropdowns Row */}
        <div className="flex gap-4 items-center mb-6">
          {/* Floor Dropdown */}
          <select
            value={selectedFloor || ''}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg font-semibold bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.floorName}
              </option>
            ))}
          </select>

          {/* Facility Dropdown (placeholder - could show facility name) */}
          <select
            disabled
            className="px-4 py-2 border border-gray-300 rounded-lg font-semibold bg-gray-100 text-gray-600 cursor-not-allowed"
          >
            <option>Toà A</option>
          </select>
        </div>

        {/* Filter Buttons Row */}
        <div className="flex gap-3 flex-wrap mb-6">
          {[
            { key: 'ALL', label: 'Tất cả', icon: '📋' },
            { key: 'AVAILABLE', label: 'Trống', icon: '🟢' },
            { key: 'OCCUPIED', label: 'Có xe', icon: '🔴' },
            { key: 'RESERVED', label: 'Đặt trước', icon: '🟡' },
            { key: 'MAINTENANCE', label: 'Bảo trì', icon: '⚙️' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedStatus(filter.key)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedStatus === filter.key
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Grid */}
      {currentFloor && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Parking Slots Grid */}
          <div className="col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              {/* Vehicle Type Filter (optional) */}
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold">
                  🚗 Ô tô
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">
                  🏍️ Xe máy
                </button>
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-8 gap-3 auto-rows-auto">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`
                      relative p-3 border-2 rounded-lg cursor-pointer
                      transition-all duration-200 hover:shadow-lg hover:scale-105
                      flex flex-col items-center justify-center
                      ${getStatusColor(slot.status)}
                      aspect-square text-center
                    `}
                    title={`${slot.slotNumber} - ${getStatusLabel(slot.status)}`}
                  >
                    {/* Slot Number */}
                    <div className="text-xs font-bold">
                      {slot.slotNumber}
                    </div>

                    {/* Status Icon */}
                    <div className="text-lg mt-1">
                      {slot.status === 'AVAILABLE' && '🟢'}
                      {slot.status === 'OCCUPIED' && '🔴'}
                      {slot.status === 'RESERVED' && '🟡'}
                      {slot.status === 'MAINTENANCE' && '⚙️'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredSlots.length === 0 && (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-lg">Không có ô đỗ xe phù hợp</p>
                </div>
              )}

              {/* Slot Count Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                <p>
                  Hiển thị: <span className="font-semibold">{filteredSlots.length}</span> /{' '}
                  <span className="font-semibold">{stats?.total}</span> ô đỗ
                </p>
              </div>
            </div>
          </div>

          {/* Right - AI Smart Insights */}
          <div className="col-span-1">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  AI Smart Insights
                </h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                  Active
                </span>
              </div>

              {/* Insight Cards */}
              <div className="space-y-4">
                {/* Card 1 */}
                <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-gray-900">Zone A sắp đầy (95%)</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Dự kiến hết chỗ trong 15 phút tới.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">👤</span>
                    <div>
                      <p className="font-semibold text-gray-900">Lưu lượng xe tăng cao</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Lượng xe ô tô tăng 12% so với cùng kỳ tuần trước.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📊</span>
                    <div>
                      <p className="font-semibold text-gray-900">Đề xuất phân luồng</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Nên điều hướng xe ô tô mới sang Zone B (còn 40 slot trống).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⏰</span>
                    <div>
                      <p className="font-semibold text-gray-900">Dự báo cao điểm</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Khung giờ cao điểm tiếp theo: 17:00 - 19:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Thống kê tầng</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng cộng:</span>
                  <span className="font-semibold">{stats?.total} ô</span>
                </div>
                <div className="flex justify-between items-center text-green-700">
                  <span>Trống:</span>
                  <span className="font-semibold">{stats?.available}</span>
                </div>
                <div className="flex justify-between items-center text-red-700">
                  <span>Đã đỗ:</span>
                  <span className="font-semibold">{stats?.occupied}</span>
                </div>
                <div className="flex justify-between items-center text-yellow-700">
                  <span>Đặt trước:</span>
                  <span className="font-semibold">{stats?.reserved}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Bảo trì:</span>
                  <span className="font-semibold">{stats?.maintenance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {floors.length === 0 && (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">Không có dữ liệu bãi đỗ xe</p>
        </div>
      )}
    </div>
  );
};

export default ParkingMapDashboard;

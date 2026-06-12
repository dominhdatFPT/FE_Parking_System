import React, { useState, useEffect } from 'react';
import ParkingMapDashboard from '../components/parking/ParkingMapDashboard';
import { parkingMapService } from '../services/parkingMapService';

const ParkingMapPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const data = await parkingMapService.getParkingFacilities();
      setFacilities(data);
      if (data.length > 0) {
        setSelectedFacility(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      // Fallback: use default parking ID
      setSelectedFacility(1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý bãi đỗ xe
          </h1>

          {/* Facility Selector */}
          {facilities.length > 0 && (
            <select
              value={selectedFacility || ''}
              onChange={(e) => setSelectedFacility(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500"
            >
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.parkingName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {selectedFacility && (
          <ParkingMapDashboard parkingId={selectedFacility} />
        )}
      </div>
    </div>
  );
};

export default ParkingMapPage;

import React from 'react';
import { useActiveParkingOrders } from '../hooks/useActiveParkingOrders';
import dayjs from 'dayjs';

const MyParkingOrders = () => {
  const { orders, loading, error, refetch } = useActiveParkingOrders();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2.5 px-6 rounded-xl font-semibold transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không có xe đang gửi</h2>
          <p className="text-gray-500">Bạn hiện không có phương tiện nào đang gửi trong bãi xe.</p>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a8a]">Xe đang gửi</h1>
          <button
            onClick={refetch}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 py-2 px-4 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left: Vehicle info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#e0e7ff] text-[#3730a3] rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h14l-1.5 8H6.5L5 10zM5 10l2-4h10l2 4" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-800">{order.licensePlate}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {order.parkingStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{order.vehicleTypeName}</p>
                </div>
              </div>

              {/* Right: Details */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-8">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Giờ vào</p>
                  <p className="font-semibold text-slate-800">
                    {order.entryTime ? dayjs(order.entryTime).format('HH:mm DD/MM/YYYY') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Vị trí</p>
                  <p className="font-semibold text-slate-800">{order.floorName}</p>
                  <p className="text-xs text-gray-500">{order.parkingName} - {order.buildingName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Phí tạm tính</p>
                  <p className="font-semibold text-[#1e3a8a] text-lg">
                    {order.calculatedFee ? order.calculatedFee.toLocaleString('vi-VN') : '0'} VNĐ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyParkingOrders;

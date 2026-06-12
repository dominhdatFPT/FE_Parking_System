import { useCallback, useEffect, useState } from 'react';
import { getActiveParkingOrders } from '../services/parkingOrderService';

function getFriendlyError(err) {
  const status = err?.response?.status;
  const message = err?.response?.data?.message;

  if (status === 404) {
    return 'Backend chưa có endpoint xe đang gửi. Hãy rebuild/restart backend hoặc kiểm tra route /api/customer/parking-orders/active.';
  }

  if (typeof message === 'string' && (message.includes('JDBC') || message.includes('SQL') || message.includes('does not exist'))) {
    return 'Backend đang lỗi cấu trúc dữ liệu. Vui lòng kiểm tra schema database.';
  }

  return message || 'Có lỗi xảy ra khi tải dữ liệu.';
}

export const useActiveParkingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveParkingOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};

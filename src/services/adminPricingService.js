import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return Array.isArray(payload) ? payload : [];
};

const unwrapData = (response) => response.data?.data ?? response.data;

export const getFeePackages = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PRICING.PACKAGES);
  return unwrapList(response);
};

export const updateFeePackagePrice = async (feePackageId, payload) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PRICING.PACKAGE_PRICE(feePackageId),
    payload,
  );
  return unwrapData(response);
};

export const toggleFeePackage = async (feePackageId) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.PRICING.PACKAGE_TOGGLE(feePackageId),
  );
  return unwrapData(response);
};

export const getVisitorFeeRates = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PRICING.VISITOR_RATES);
  return unwrapList(response);
};

export const updateVisitorFeeRate = async (vehicleTypeId, payload) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PRICING.VISITOR_RATE(vehicleTypeId),
    payload,
  );
  return unwrapData(response);
};

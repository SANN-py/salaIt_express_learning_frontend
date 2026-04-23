import { api } from "./lib/axios";
export const createPayment = async (orderId: number) => {
  const res = await api.post(`/api/v1/payments/${orderId}`);
  return res;
};
export const checkTransaction = async (tranId: string) => {
  const res = await api.post(`/api/v1/payments/${tranId}/check`);
  return res;
};

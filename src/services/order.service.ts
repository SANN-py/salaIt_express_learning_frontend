import { api } from "./lib/axios";

export interface orderPayload {
  discount: number;
  items: {
    productId: number;
    qty: number;
  }[];
}
export const createOrder = async (request: orderPayload) => {
  const res = await api.post("/api/v1/orders/create", request);
  return res;
};

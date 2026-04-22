import { api } from "./lib/axios";

export interface orderPayload {
  discount: number;
  items: {
    productId: number;
    qty: number;
  }[];
}
export const createOrder = async (request: orderPayload) => {
  return await api.post("/api/v1/orders/create", request);
};

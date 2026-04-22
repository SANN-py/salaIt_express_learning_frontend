import type { productSchema } from "../components/form/ProductForm";
import { api } from "./lib/axios";

// const BASE_URI = "http://localhost:3000";

const createProduct = async (request: productSchema) => {
  return await api.post(`/api/v1/products`, request);

  // const res = await fetch(`${BASE_URI}/products`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(request),
  // });

  // const data = await res.json();
  // return data;
};

const updateProduct = async (id: number, request: productSchema) => {
  return await api.put(`/api/v1/products/${id}`, request);

  // const res = await fetch(`/api/v1/products/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(request),
  // });

  // const data = await res.json();
  // return data;
};
//this not allow to delete
const deleteProduct = async (id: number) => {
  return await api.delete(`/api/v1/products/${id}`);
};

const getProduct = async (
  search?: string,
  page: number = 1,
  limit: number = 10,
  categoryId?: number,
) => {
  return await api.get(`/api/v1/products`, {
    params: { search, page, limit, categoryId },
  });

  // const res = await fetch(
  //   `${BASE_URI}/products?search=${search}&page=${page}&limit=${limit}`,
  // );
  // const data = await res.json();
  // console.log("data", data);

  // return data;
};

const uploadProductImage = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await api.post(`/api/v1/products/upload/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // const res = await fetch(`api/v1/upload/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(file),
  // });

  // const data = await res.json();
  // return data;
};

const deleteProductImage = async (id?: number) => {
  return await api.delete(`/api/v1/products/images/${id}`);
};

export {
  getProduct,
  createProduct,
  uploadProductImage,
  deleteProductImage,
  updateProduct,
  deleteProduct,
};

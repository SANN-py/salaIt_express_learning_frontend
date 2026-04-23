import { api } from "./lib/axios";

// const BASE_URI = "http://localhost:3000/api/v1";

export interface CategoryPayload {
  name: string;
}

const getCategories = async (search?: string, page = 1, limit = 10) => {
  const res = await api.get(`api/v1/categories`, {
    params: { search, page, limit },
  });
  // console.log("res", res);
  // return res;

  // const res = await fetch(`${BASE_URI}/categories?search=${search}`);
  // const data = await res.json();
  // console.log("data", data);

  // return data;
  return res;
};

const getCategoryList = async () => {
  const res = await api.get(`api/v1/categories/list`);

  // const res = await fetch(`${BASE_URI}/categories/list`);
  // const data = await res.json();
  // console.log("data", data);

  // return data;
  return res;
};

const createCategory = async (request: CategoryPayload) => {
  const res = await api.post(`api/v1/categories`, request);

  // const res = await fetch(`${BASE_URI}/categories`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(request),
  // });

  // const data = await res.json();
  // return data;

  return res;
};
const updateCategory = async (id: number, request: CategoryPayload) => {
  return await api.put(`api/v1/categories/${id}`, request);

  // const res = await fetch(`${BASE_URI}/categories/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(request),
  // });

  // const data = await res.json();
  // return data;
};
const deleteCategory = async (id?: number) => {
  const res = await api.delete(`api/v1/categories/${id}`);

  // const res = await fetch(`${BASE_URI}/categories/${id}`, {
  //   method: "DELETE",
  //   headers: { "Content-Type": "application/json" },
  // });

  // const data = await res.json();
  // return data;
  return res;
};

export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryList,
};

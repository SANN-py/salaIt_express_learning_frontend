import { api } from "./lib/axios";

export interface LogInPayload {
  email: string;
  password: string;
}

// const BASE_URI = "http://localhost:3000/api/v1";
const authLogin = async (request?: LogInPayload) => {
  const res = await api.post(`/api/v1/auth/login`, request);

  // const res = await fetch(`${BASE_URI}/users/login`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(request),
  // });
  // const data = await res.json();
  // return data;
  return res.data;
};

export { authLogin };

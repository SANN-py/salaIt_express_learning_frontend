const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};

export { setAccessToken, getAccessToken, removeAccessToken };

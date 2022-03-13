import http from "../http-common";
const prefix = "/storage";
import authHeader from "./auth-header";
const xToken = authHeader();

const getAllProductInStorage = async () => {
  return http.get(prefix + "/getAllProductInStorage", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getAllStuffInStorage = async () => {
  return http.get(prefix + "/getAllStuffInStorage", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getAllIngrInStorage = async () => {
  return http.get(prefix + "/getAllIngrInStorage", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getRemainOnlyProductId = async () => {
  return http.get(prefix + "/getRemainOnlyProductId", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getItemMakeRequest = async () => {
  return http.get(prefix + "/getItemMakeRequest", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};

export default {
  getAllProductInStorage,
  getAllIngrInStorage,
  getAllStuffInStorage,
  getRemainOnlyProductId,
  getItemMakeRequest,
};

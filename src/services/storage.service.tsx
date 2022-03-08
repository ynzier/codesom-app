import http from "../../http-common";
const prefix = "/storage";
import authHeader from "./auth-header";
const xToken = authHeader();

const getAllProductInStorage = async () => {
  return http.get(prefix + "/getAllProductInStorage", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getRemainOnlyProductId = async () => {
  return http.get(prefix + "/getRemainOnlyProductId", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};

export default {
  getAllProductInStorage,
  getRemainOnlyProductId,
};

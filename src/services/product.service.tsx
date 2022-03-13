import http from "../http-common";
const prefix = "/product";
import authHeader from "./auth-header";
const getAllProductsInBranch = async () => {
  const xToken = authHeader();
  return http.get(prefix + "/getAllProductInBranch", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getAllProductTypes = async () => {
  const xToken = authHeader();
  return http.get(prefix + "/getAllProductTypes", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
export default {
  getAllProductsInBranch,
  getAllProductTypes,
};

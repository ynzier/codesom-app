import http from "../http-common";
const prefix = "/storage";
import authHeader from "./auth-header";

const getAllProductInStorage = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAllProductInStorage", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getAllStuffInStorage = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAllStuffInStorage", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getAllIngrInStorage = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAllIngrInStorage", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getRemainOnlyProductId = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getRemainOnlyProductId", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getItemMakeRequest = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getItemMakeRequest", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

const checkRecipeCartAvailable = async (cartData: any) => {
  const xToken = authHeader();
  return http.post(
    prefix + "/checkRecipeCartAvailable",
    { needProcess: cartData },
    {
      headers: { "x-access-token": JSON.parse(await xToken) as string },
    }
  );
};
const getAllStuffForWithdraw = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAllStuffForWithdraw", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const createWithdrawStuff = async (data: any) => {
  const xToken = await authHeader();
  return http.post(prefix + "/createWithdrawStuff", data, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
export default {
  getAllProductInStorage,
  getAllIngrInStorage,
  getAllStuffInStorage,
  getRemainOnlyProductId,
  getItemMakeRequest,
  checkRecipeCartAvailable,
  getAllStuffForWithdraw,
  createWithdrawStuff,
};

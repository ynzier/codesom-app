import http from "../../http-common";
const prefix = "/order";
import authHeader from "./auth-header";
const xToken = authHeader();
const createOrderApp = async (data: any) => {
  return http.post(prefix + "/createOrderApp", data, {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const listOrderApp = async () => {
  return http.get(prefix + "/listOrderApp", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};

const updateOrderStatus = async (data: any) => {
  return http.put(prefix + "/updateStatus", data, {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
export default { createOrderApp, listOrderApp, updateOrderStatus };

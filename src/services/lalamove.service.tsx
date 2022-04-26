import http from "../http-common";
const prefix = "/lalamove";
import authHeader from "./auth-header";

const getAppNotifCount = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAppNotifCount", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

const getDeliveryListApp = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getDeliveryListApp", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getOrderItemApp = async (id: string | number) => {
  const xToken = await authHeader();
  return http.get(prefix + "/getOrderItemApp/" + id, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default {
  getAppNotifCount,
  getDeliveryListApp,
  getOrderItemApp,
};

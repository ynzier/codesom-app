import http from "../http-common";
const prefix = "/order";
import authHeader from "./auth-header";
const createOrderApp = async (data: any) => {
  const xToken = await authHeader();
  return http.post(prefix + "/createOrderApp", data, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const listOrderApp = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/listOrderApp", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

const updateOrderStatus = async (data: any) => {
  const xToken = await authHeader();
  return http.put(prefix + "/updateStatus", data, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getReceiptByOrderId = async (ordId: any) => {
  const xToken = await authHeader();
  return http.get(prefix + "/getReceiptByOrderId", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
    params: { ordId: ordId },
  });
};
export default {
  createOrderApp,
  listOrderApp,
  updateOrderStatus,
  getReceiptByOrderId,
};

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
const getQR = async (data: any) => {
  const xToken = await authHeader();
  return http.post(prefix + "/getQRCode", data, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const checkCompleteCharge = async (id: string) => {
  const xToken = await authHeader();
  return http.post(
    prefix + "/checkCompleteCharge",
    { chrgId: id },
    {
      headers: { "x-access-token": JSON.parse(xToken) as string },
    }
  );
};
const createOrderOmise = async (data: any) => {
  const xToken = await authHeader();
  return http.post(prefix + "/createOrderOmise", data, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
export default {
  createOrderApp,
  listOrderApp,
  updateOrderStatus,
  getReceiptByOrderId,
  getQR,
  checkCompleteCharge,
  createOrderOmise,
};

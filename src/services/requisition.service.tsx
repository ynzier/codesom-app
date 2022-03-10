import http from "../http-common";
const prefix = "/requisition";
import authHeader from "./auth-header";
const xToken = authHeader();

const listReqApp = async () => {
  return http.get(prefix + "/listReqApp", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const createReqApp = async (data: any) => {
  return http.post(prefix + "/createReqApp", data, {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};

const updateReqStatus = async (id: any, data: any) => {
  return http.put(prefix + "/updateReqStatus", data, {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
    params: { id: id },
  });
};
const getReqItemsById = async (id: any) => {
  return http.get(prefix + "/getReqItemsById", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
    params: { id: id },
  });
};
const getReqDetailById = async (id: any) => {
  return http.get(prefix + "/getReqDetailById", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
    params: { id: id },
  });
};

export default {
  listReqApp,
  createReqApp,
  updateReqStatus,
  getReqItemsById,
  getReqDetailById,
};

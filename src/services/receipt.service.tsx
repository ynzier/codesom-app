import http from "../../http-common";
const prefix = "/receipt";
import authHeader from "./auth-header";
const xToken = authHeader();
const createReceipt = async (data: any) => {
  return http.post(prefix + "/createReceipt", data, {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};

export default { createReceipt };

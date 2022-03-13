import http from "../http-common";
const prefix = "/receipt";
import authHeader from "./auth-header";
const createReceipt = async (data: any) => {
  const xToken = await authHeader();
  return http.post(prefix + "/createReceipt", data, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default { createReceipt };

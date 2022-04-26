import http from "../http-common";
const prefix = "/delivery";
import authHeader from "./auth-header";

const getAllPlatform = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAllPlatform", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
export default {
  getAllPlatform,
};

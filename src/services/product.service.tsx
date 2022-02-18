import http from "../../http-common";
const prefix = "/product";
import authHeader from "./auth-header";

const getAllProducts = async () => {
  const xToken = await authHeader();
  console.log(xToken);
  return http.get(prefix + "/getAllProducts", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default {
  getAllProducts,
};

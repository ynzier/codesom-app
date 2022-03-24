import http from "../http-common";
const prefix = "/report";
import authHeader from "./auth-header";
const getTopSaleBranch = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getTopSaleBranch", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default { getTopSaleBranch };

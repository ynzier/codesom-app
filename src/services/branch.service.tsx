import http from "../../http-common";
const prefix = "/branch";
import authHeader from "./auth-header";

const getCurrentBranch = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getCurrentBranch", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};
const getCurrentBranchWithOutImage = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getCurrentBranchWithOutImage", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default {
  getCurrentBranch,
  getCurrentBranchWithOutImage,
};

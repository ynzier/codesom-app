import http from "../../http-common";
const prefix = "/employee";
import authHeader from "./auth-header";

const getAllEmployeeInBranch = async () => {
  const xToken = await authHeader();
  console.log(xToken);
  return http.get(prefix + "/getAllEmployeeInBranch", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default {
  getAllEmployeeInBranch,
};

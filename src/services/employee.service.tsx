import http from "../http-common";
const prefix = "/employee";
import authHeader from "./auth-header";

const getAllEmployeeInBranch = async () => {
  const xToken = await authHeader();
  return http.get(prefix + "/getAllEmployeeInBranch", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

const empSignCheck = async (empId: number) => {
  const xToken = await authHeader();
  return http.get(prefix + "/empSignCheck/" + empId, {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default {
  getAllEmployeeInBranch,
  empSignCheck,
};

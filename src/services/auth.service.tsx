import http from "../http-common";
import deviceStorage from "./deviceStorage";
import authHeader from "./auth-header";
interface AccessToken {
  accessToken: string;
}
const signInApp = async (userName: string, password: string) => {
  const promise = new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(
        http
          .post<AccessToken>("/auth/signinApp", {
            branchUsername: userName.toLowerCase(),
            branchPassword: password,
          })
          .then(async (response) => {
            console.log(response.data.accessToken);
            await deviceStorage.deleteJWT();
            await deviceStorage.setToken(response.data.accessToken);
          })
      );
    }, 3000);
  });
  return promise;
};
const checkCurrentSession = async () => {
  console.log("checking session");
  const xToken = await authHeader();
  return await http.get("/auth/checkCurrentSession", {
    headers: { "x-access-token": JSON.parse(xToken) as string },
  });
};

export default {
  signInApp,

  checkCurrentSession,
};

import http from "../../http-common";
import { deviceStorage } from "services";
interface AccessToken {
  accessToken: string;
}
const signInApp = async (userName: string, password: string) => {
  const promise = new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(
        http
          .post<AccessToken>("/auth/signinApp", {
            brUserName: userName.toLowerCase(),
            brPassword: password,
          })
          .then(async (response) => {
            await deviceStorage.deleteJWT();
            await deviceStorage.setToken(response.data.accessToken);
          })
      );
    }, 3000);
  });
  return promise;
};

const logoutApp = () => {
  // localStorage.deleteJWT()
};

const getCurrentUser = () => {
  // return JSON.parse(localStorage.getItem("user"));
};

export default {
  signInApp,
  logoutApp,
  getCurrentUser,
};

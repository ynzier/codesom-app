import http from "../../http-common";
import deviceStorage from "./deviceStorage";
interface AccessToken {
  accessToken: string;
}
const signInApp = (userName: string, password: string) => {
  return http
    .post<AccessToken>("/auth/signinApp", {
      brUserName: userName.toLowerCase(),
      brPassword: password,
    })
    .then((response) => {
      void deviceStorage.setToken(response.data.accessToken);
    });
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

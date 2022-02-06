import http from "../http-common";
import deviceStorage from "./deviceStorage";

const signInApp: FunctionalComponent = (userName: string, password: string) => {
  return http
    .post("/auth/signinApp", {
      brUserName: userName.toLowerCase(),
      brPassword: password,
    })
    .then((response) => {
      deviceStorage.setToken(response.data.accessToken);
    });
};

const logoutApp = () => {
  localStorage.deleteJWT();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  signInApp,
  logoutApp,
  getCurrentUser,
};

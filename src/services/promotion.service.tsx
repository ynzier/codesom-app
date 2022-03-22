import http from "../http-common";
const prefix = "/promotion";
import authHeader from "./auth-header";

const getAllPromotion = async () => {
  const xToken = authHeader();
  return http.get(prefix + "/getAllPromotion", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
const getPromoItemToCart = async (promoId: number) => {
  const xToken = authHeader();
  return http.get(prefix + "/getPromoItemToCart", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
    params: { promoId: promoId },
  });
};

export default {
  getAllPromotion,
  getPromoItemToCart,
};

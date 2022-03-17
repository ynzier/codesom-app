import http from "../http-common";
const prefix = "/product";
import authHeader from "./auth-header";
const getAllProductsInBranch = async () => {
  const xToken = authHeader();
  return http.get(prefix + "/getAllProductInBranch", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};

const getRecipeByIdIncStorage = async (productId: number) => {
  const xToken = authHeader();
  return http.get(prefix + "/getRecipeByIdIncStorage", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
    params: { productId: productId },
  });
};
const getRecipeById = async (productId: number) => {
  const xToken = authHeader();
  return http.get(prefix + "/getRecipeById", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
    params: { productId: productId },
  });
};
const getAllProductTypes = async () => {
  const xToken = authHeader();
  return http.get(prefix + "/getAllProductTypes", {
    headers: { "x-access-token": JSON.parse(await xToken) as string },
  });
};
export default {
  getAllProductsInBranch,
  getAllProductTypes,
  getRecipeByIdIncStorage,
  getRecipeById,
};

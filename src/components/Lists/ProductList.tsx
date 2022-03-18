import {
  Avatar,
  Text,
  FlatList,
  Box,
  VStack,
  Button,
  Center,
} from "native-base";
import React, { useState, useEffect, useCallback } from "react";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { storageService } from "services";
import RecipeModal from "../Modals/RecipeModal";
import NumberFormat from "react-number-format";
interface productData {
  key?: number;
  productId: number;
  branchId: number;
  itemRemain: number;
  updatedAt: string;
  product: {
    prId: number;
    prName: string;
    prPrice: number;
    prImg?: number;
    prCount?: number;
    prType?: number;
    prStatus?: string;
    prDetail?: string;
    needProcess?: number;
    product_type?: {
      typeId: number;
      typeName: string;
      typeStatus: string;
    };
    image?: {
      imgId: number;
      imgObj: string;
    };
  };
}
const ProductList = ({
  cartData,
  setCartData,
  tabIndex,
}: {
  cartData: any;
  setCartData: (value: any) => void;
  tabIndex: number;
}) => {
  const { promiseInProgress } = usePromiseTracker();
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [recipeId, setRecipeId] = useState<any>();
  const [productArray, setProductArray] = useState<productData[]>([]);
  const [filterData, setfilterData] = useState<productData[]>([]);
  const ErrorImg =
    "data:image/png;base64,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";

  const isInCart = (itemId: number) => {
    if (
      cartData.filter((e: { prId: number }) => e.prId === itemId).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };
  const addToCart = (item: productData) => {
    setCartData((prev: any) => [...prev, item]);
  };
  const fetchProductData = (isSubscribed: boolean) => {
    void trackPromise(
      storageService
        .getAllProductInStorage()
        .then((res) => {
          if (isSubscribed) {
            if (res) {
              const recData = res.data;
              setProductArray(recData);
            }
          }
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          Toast.show({
            type: ALERT_TYPE.DANGER,
            textBody: resMessage,
          });
        })
    );
  };
  useFocusEffect(
    useCallback(() => {
      let isSubscribed = true;
      fetchProductData(isSubscribed);

      return () => {
        setProductArray([]);
        isSubscribed = false;
      };
    }, [])
  );
  useEffect(() => {
    const getFilter = (value: number) => {
      if (value && value != -1) {
        const filterTable = productArray.filter(
          (productArray) => productArray.product.prType == value
        );
        setfilterData(filterTable);
      } else {
        setfilterData(productArray);
      }
    };
    getFilter(tabIndex);
    return () => {};
  }, [productArray, tabIndex]);

  return (
    <>
      {recipeOpen && (
        <RecipeModal
          recipeOpen={recipeOpen}
          setRecipeOpen={setRecipeOpen}
          recipeId={recipeId}
        />
      )}
      <Box alignSelf="center" w="100%">
        <FlatList
          numColumns={3}
          onRefresh={() => {
            fetchProductData(true);
          }}
          refreshing={promiseInProgress}
          data={filterData == null ? productArray : filterData}
          keyExtractor={(item: any) => item.productId}
          renderItem={({ item }: ListRenderItemInfo<productData>) => {
            return (
              <Box
                h={{ md: 140, xl: 260 }}
                w={{ md: 180, xl: 440 }}
                flexDirection="row"
                ml={{ md: 6, xl: 6 }}
                mr={{ md: 16, xl: 4 }}
                mt={{ md: 4, xl: 2 }}
                mb={{ md: 4, xl: 2 }}
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  bg="#FFFDFA"
                  shadow={3}
                  zIndex={3}
                  alignSelf="center"
                  position="absolute"
                  left={0}
                  size={{ md: 140, xl: 240 }}
                  source={{
                    uri:
                      item.product.image && item.product.image.imgObj
                        ? item.product.image.imgObj
                        : ErrorImg,
                  }}
                />

                <Button
                  colorScheme="greenalt"
                  position={
                    isInCart(item.product.prId) ? "relative" : "absolute"
                  }
                  shadow={4}
                  zIndex={4}
                  left={{ md: "50px", xl: 90 }}
                  bottom={{ md: 1, xl: 25 }}
                  alignSelf="center"
                  size={{ md: 10, xl: 60 }}
                  borderRadius="80"
                  disabled={isInCart(item.product.prId)}
                  display={isInCart(item.product.prId) ? "none" : "flex"}
                  onPress={() => {
                    if (item.product.needProcess)
                      return addToCart({
                        key:
                          item.product.prId +
                          Math.floor(Math.random() * (100000 - 1) + 1) * 100,
                        prId: item.product.prId,
                        prName: item.product.prName,
                        prPrice: item.product.prPrice,
                        prCount: 1,
                        needProcess: item.product.needProcess,
                      });
                    if (item.itemRemain == 0 && !item.product.needProcess) {
                      return Toast.show({
                        type: ALERT_TYPE.DANGER,
                        textBody: "สินค้าในคลังไม่เพียงพอ",
                      });
                    }
                    if (item.itemRemain > 0 && !isInCart(item.product.prId)) {
                      return addToCart({
                        key:
                          item.product.prId +
                          Math.floor(Math.random() * (100000 - 1) + 1) * 100,
                        prId: item.product.prId,
                        prName: item.product.prName,
                        prPrice: item.product.prPrice,
                        prCount: 1,
                      });
                    }
                  }}
                >
                  <Text fontSize={{ md: 24, xl: 38 }} color="white">
                    +
                  </Text>
                </Button>
                <Box
                  h={{ md: 110, xl: 170 }}
                  w={{ md: 170, xl: 250 }}
                  ml={{ md: 160, xl: 200 }}
                  pl={{ md: 10, xl: 8 }}
                  borderRadius={16}
                  borderWidth={1}
                  flexDirection="row"
                >
                  <VStack
                    pl={{ md: 18, xl: 8 }}
                    pr={{ md: 2, xl: 4 }}
                    justifyContent="center"
                    fontSize={16}
                  >
                    <Text
                      fontWeight={400}
                      fontSize={{ md: 12, xl: 18 }}
                      flexWrap="wrap"
                    >
                      {item.product.prName}
                    </Text>

                    <NumberFormat
                      value={item.product.prPrice}
                      displayType={"text"}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale
                      renderText={(formattedValue) => (
                        <Text
                          fontWeight={400}
                          fontSize={{ md: 12, xl: 18 }}
                          flexWrap="wrap"
                        >
                          {formattedValue} บาท
                        </Text>
                      )}
                    />
                    {!item.product.needProcess ? (
                      <Text
                        fontWeight={300}
                        fontSize={{ md: 12, xl: 18 }}
                        flexWrap="wrap"
                        color={item.itemRemain < 1 ? "red.500" : "#ABBBC2"}
                      >
                        คงเหลือ {item.itemRemain}
                      </Text>
                    ) : (
                      <Text
                        fontWeight={300}
                        fontSize={{ md: 12, xl: 18 }}
                        flexWrap="wrap"
                        color="#ABBBC2"
                        textDecorationLine="underline"
                        onPress={() => {
                          setRecipeId(item.productId);
                          setRecipeOpen(true);
                        }}
                      >
                        ดูส่วนผสม
                      </Text>
                    )}
                  </VStack>
                </Box>
              </Box>
            );
          }}
        />
      </Box>
    </>
  );
};

export default ProductList;

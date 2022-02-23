import {
  Avatar,
  Text,
  FlatList,
  Box,
  VStack,
  Button,
  Center,
} from "native-base";
import BouncingPreloader from "../components/BouncingLoader";
import React, { useEffect, useState } from "react";
import { ListRenderItemInfo } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import ProductService from "../services/product.service";
interface productData {
  key?: number;
  prId: number;
  prName: string;
  prPrice: number;
  prImg?: number;
  prCount?: string;
  prType?: number;
  prStatus?: string;
  prDetail?: string;
  product_type?: {
    typeId: number;
    typeName: string;
    typeStatus: string;
  };
  image?: {
    imgId: number;
    imgObj: string;
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
      ProductService.getAllProducts()
        .then((res) => {
          if (isSubscribed) {
            if (res) {
              const recData = res.data;
              setProductArray(recData);
            }
          }
        })
        .catch((err) => {
          if (isSubscribed) {
            console.log(err);
          }
        })
    );
  };
  useEffect(() => {
    let isSubscribed = true;
    fetchProductData(isSubscribed);
    return () => {
      isSubscribed = false;
    };
  }, []);
  useEffect(() => {
    const getFilter = (value: number) => {
      if (value && value != -1) {
        const filterTable = productArray.filter(
          (productArray) => productArray.prType == value
        );
        setfilterData(filterTable);
      } else {
        setfilterData(productArray);
      }
    };
    getFilter(tabIndex);
    return () => {};
  }, [productArray, tabIndex]);

  return promiseInProgress ? (
    <Center flex="1" pt="16" justifyContent="center" alignItems="center">
      <BouncingPreloader icons={[require("../assets/bouncingOrange.png")]} />
    </Center>
  ) : (
    <>
      <Box alignSelf="center" w="100%">
        <FlatList
          numColumns={3}
          data={filterData == null ? productArray : filterData}
          keyExtractor={(item: any) => item.prId}
          renderItem={({ item }: ListRenderItemInfo<productData>) => {
            return (
              <Box
                h={{ md: 140, xl: 240 }}
                flex="1"
                flexDirection="row"
                mx={{ md: 2, xl: 6 }}
                mt={{ md: 4, xl: 2 }}
                mb={{ md: 4, xl: 2 }}
                justifyContent="center"
                alignItems="center"
              >
                <Box zIndex={1} flex="1" w="100%" h="100%">
                  <Avatar
                    left="0"
                    shadow={3}
                    zIndex={3}
                    alignSelf="center"
                    position="absolute"
                    size={{ md: 140, xl: 240 }}
                    source={{
                      uri:
                        item.image && item.image.imgObj
                          ? item.image.imgObj
                          : ErrorImg,
                    }}
                  />

                  <Button
                    colorScheme="greenalt"
                    position={isInCart(item.prId) ? "relative" : "absolute"}
                    shadow={4}
                    zIndex={4}
                    left={{ md: "50px", xl: 90 }}
                    bottom={{ md: 1, xl: 25 }}
                    alignSelf="center"
                    size={{ md: 10, xl: 60 }}
                    borderRadius="80"
                    disabled={isInCart(item.prId)}
                    display={isInCart(item.prId) ? "none" : "flex"}
                    onPress={() => {
                      if (!isInCart(item.prId)) {
                        addToCart({
                          key:
                            item.prId +
                            Math.floor(Math.random() * (100000 - 1) + 1) * 100,
                          prId: item.prId,
                          prName: item.prName,
                          prPrice: item.prPrice,
                          prCount: "1",
                        });
                      }
                    }}
                  >
                    <Text fontSize={{ md: 24, xl: 38 }} color="white">
                      +
                    </Text>
                  </Button>
                </Box>
                <Box
                  h={{ md: 110, xl: 170 }}
                  flex="3"
                  w="100%"
                  pl="45%"
                  borderRadius={16}
                  borderWidth={1}
                  flexDirection="row"
                >
                  <VStack justifyContent="center">
                    <Text
                      fontWeight={400}
                      fontSize={{ md: 12, xl: 18 }}
                      flexWrap="wrap"
                    >
                      {item.prName}
                    </Text>

                    <Text
                      fontWeight={200}
                      fontSize={{ md: 12, xl: 18 }}
                      flexWrap="wrap"
                    >
                      {item.prPrice} บาท/ถ้วย
                    </Text>
                    <Text
                      fontWeight={200}
                      fontSize={{ md: 10, xl: 18 }}
                      flexWrap="wrap"
                      color="#ABBBC2"
                    >
                      คงเหลือ 200 ถ้วย
                    </Text>
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

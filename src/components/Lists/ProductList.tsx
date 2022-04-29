import {
  Avatar,
  Text,
  FlatList,
  Box,
  VStack,
  Pressable,
  Button,
  HStack,
  Image,
  Spacer,
} from "native-base";
import React, { useState, useEffect, useCallback } from "react";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo, StyleSheet } from "react-native";
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
    productId: number;
    productName: string;
    productPrice: number;
    productImg?: number;
    quantity?: number;
    productType?: number;
    productStatus?: string;
    productDetail?: string;
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
  const { promiseInProgress: loadingProduct } = usePromiseTracker({
    area: "loadingProduct",
  });
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [recipeId, setRecipeId] = useState<any>();
  const [productArray, setProductArray] = useState<productData[]>([]);
  const [filterData, setfilterData] = useState<productData[]>([]);
  const [fetched, setFetched] = useState(false);
  const ErrorImg =
    "data:image/png;base64,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";

  const isInCart = (itemId: number) => {
    if (
      cartData.filter((e: { productId: number }) => e.productId === itemId)
        .length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };
  const addToCart = (item: any) => {
    setCartData((prev: any) => [...prev, item]);
  };
  const handleAdd = (item: any) => {
    if (item.product.needProcess)
      return addToCart({
        key:
          item.product.productId +
          Math.floor(Math.random() * (100000 - 1) + 1) * 100,
        productId: item.product.productId,
        productName: item.product.productName,
        productPrice: item.product.productPrice,
        quantity: 1,
        needProcess: item.product.needProcess,
      });
    if (item.itemRemain == 0 && !item.product.needProcess) {
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: "สินค้าในคลังไม่เพียงพอ",
      });
    }
    if (item.itemRemain > 0 && !isInCart(item.product.productId)) {
      return addToCart({
        key:
          item.product.productId +
          Math.floor(Math.random() * (100000 - 1) + 1) * 100,
        productId: item.product.productId,
        productName: item.product.productName,
        productPrice: item.product.productPrice,
        quantity: 1,
      });
    }
  };
  const fetchProductData = (isSubscribed: boolean) => {
    void trackPromise(
      storageService
        .getAllProductInStorage()
        .then((res) => {
          if (isSubscribed) {
            const recData = res.data;
            setFetched(true);
            setProductArray(recData);
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
        }),
      "loadingProduct"
    );
  };
  useFocusEffect(
    useCallback(() => {
      let isSubscribed = true;
      if (!fetched) fetchProductData(isSubscribed);

      return () => {
        isSubscribed = false;
      };
    }, [fetched])
  );
  useEffect(() => {
    const getFilter = (value: number) => {
      if (value && value != -1) {
        const filterTable = productArray.filter(
          (productArray) => productArray.product.productType == value
        );
        setfilterData(filterTable);
      } else {
        setfilterData(productArray);
      }
    };
    getFilter(tabIndex);
    return () => {};
  }, [productArray, tabIndex]);
  const formatData = (data: any[]) => {
    const numberOfFullRows = Math.floor(data.length / 4);

    let numberOfElementsLastRow = data.length - numberOfFullRows * 4;
    while (numberOfElementsLastRow !== 4 && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };
  const renderItem = ({ item }: { item: any }) => {
    if (item.empty === true) {
      return <Box style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <Box style={styles.item} borderColor="light.300">
        <Image
          alt={item.product.productName || ""}
          width={"100%"}
          h="100%"
          position={"absolute"}
          source={{
            uri: item?.product?.image?.imgObj || ErrorImg,
          }}
        />

        <NumberFormat
          value={item.product.productPrice}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={0}
          fixedDecimalScale
          renderText={(formattedValue) => (
            <Text
              bg="red.700"
              fontWeight={400}
              numberOfLines={1}
              paddingLeft={2}
              paddingRight={2}
              paddingTop={1}
              paddingBottom={1}
              marginBottom={16}
              color="light.100"
              alignSelf="flex-end"
            >
              {formattedValue}฿
            </Text>
          )}
        />

        <VStack
          pl={{ md: 18, xl: 8 }}
          pr={{ md: 2, xl: 4 }}
          w="100%"
          position={"absolute"}
          bottom={0}
          bg="orange.100"
          justifyContent="center"
        >
          <Text fontWeight={600} flexWrap="wrap">
            {item.product.productName}
          </Text>

          <HStack w="100%">
            {!item.product.needProcess ? (
              <Text
                fontWeight={300}
                flexWrap="wrap"
                flex="1"
                numberOfLines={1}
                fontSize={12}
                color={item.itemRemain < 1 ? "red.500" : "light.600"}
              >
                คงเหลือ {item.itemRemain}
              </Text>
            ) : (
              <Pressable
                _pressed={{ bg: "amber.400", borderRadius: 2 }}
                onPress={() => {
                  setRecipeId(item.productId);
                  setRecipeOpen(true);
                }}
              >
                <Text
                  fontWeight={300}
                  fontSize={12}
                  flexWrap="wrap"
                  textDecorationLine="underline"
                >
                  การผสม
                </Text>
              </Pressable>
            )}
            <Spacer />
            <Pressable
              _pressed={{ bg: "amber.400", borderRadius: 2 }}
              display={isInCart(item.productId) ? "none" : "flex"}
              onPress={() => {
                handleAdd(item);
              }}
            >
              <Text
                fontWeight={300}
                fontSize={12}
                flexWrap="wrap"
                textDecorationLine="underline"
              >
                เลือก
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </Box>
    );
  };
  return (
    <>
      {recipeOpen && (
        <RecipeModal
          recipeOpen={recipeOpen}
          setRecipeOpen={setRecipeOpen}
          recipeId={recipeId}
        />
      )}
      <Box alignSelf="center" w="100%" h="100%">
        <FlatList
          numColumns={4}
          w="100%"
          h="100%"
          onRefresh={() => {
            fetchProductData(true);
          }}
          contentContainerStyle={{ paddingTop: 4 }}
          refreshing={loadingProduct}
          data={formatData(filterData == null ? productArray : filterData)}
          keyExtractor={(item: any) => item.productId}
          renderItem={renderItem}
        />
      </Box>
    </>
  );
};

export default ProductList;
const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row-reverse",
    flex: 1,
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderWidth: 1,
    margin: 0.5,
  },
  itemInvisible: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
});

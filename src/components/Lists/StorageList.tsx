import { Text, FlatList, VStack, HStack } from "native-base";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { storageService } from "services";
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
    recipeId?: number;
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
const StorageList = ({ keyword }: { keyword: string }) => {
  const { promiseInProgress: storageList } = usePromiseTracker({
    area: "storageList",
  });
  const [productArray, setProductArray] = useState<productData[]>([]);
  const [fetched, setFetched] = useState(false);
  const [filterData, setfilterData] = useState<productData[]>([]);
  const fetchProductData = async (isSubscribed: boolean) => {
    await trackPromise(
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
      "storageList"
    );
  };

  useFocusEffect(
    useCallback(() => {
      let isSubscribed = true;
      if (!fetched) void fetchProductData(isSubscribed);

      return () => {
        isSubscribed = false;
      };
    }, [fetched])
  );
  useFocusEffect(
    useCallback(() => {
      const search = (value: string) => {
        const filterTable = productArray.filter((o: any) =>
          Object.keys(o).some((k: any) =>
            String(o[k]).toLowerCase().includes(value.toLowerCase())
          )
        );
        setfilterData(filterTable);
      };
      search(keyword);
      return () => {};
    }, [keyword, productArray])
  );

  return (
    <VStack
      w="100%"
      flex="12"
      px={4}
      py={2}
      mt="2"
      borderTopWidth={1}
      borderColor="light.300"
    >
      <HStack
        borderBottomWidth={1}
        borderColor="light.300"
        h="12"
        justifyContent="center"
        alignItems="center"
        mb="4"
      >
        <Text flex="1" textAlign="center" fontWeight={600} letterSpacing="xl">
          รหัสสินค้า
        </Text>

        <Text flex="2" textAlign="center" fontWeight={600} letterSpacing="xl">
          ชื่อสินค้า
        </Text>

        <Text flex="1" textAlign="center" fontWeight={600} letterSpacing="xl">
          ราคา/หน่วย
        </Text>

        <Text flex="1" textAlign="center" fontWeight={600} letterSpacing="xl">
          คงเหลือ
        </Text>
      </HStack>
      <FlatList
        data={filterData == null ? productArray : filterData}
        refreshing={storageList}
        onRefresh={() => {
          void fetchProductData(true);
        }}
        keyExtractor={(item: any) => item.product.productId}
        renderItem={({ item }: ListRenderItemInfo<productData>) => {
          return (
            <HStack
              key={item.product.productId}
              w="100%"
              justifyContent="center"
              alignItems="center"
              h="12"
            >
              <Text flex="1" textAlign="center">
                {item.product.productId}
              </Text>

              <Text flex="2" textAlign="center">
                {item.product.productName}
              </Text>
              <NumberFormat
                value={item.product.productPrice}
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale
                renderText={(formattedValue) => (
                  <Text flex="1" textAlign="center">
                    {formattedValue}
                  </Text>
                )}
              />
              {item.product.recipeId ? (
                <Text
                  flex="1"
                  textAlign="center"
                  textDecorationLine="underline"
                >
                  ดูสูตรผสม
                </Text>
              ) : (
                <Text
                  flex="1"
                  textAlign="center"
                  color={item.itemRemain < 20 ? "red.500" : "light.900"}
                >
                  {item.itemRemain}
                </Text>
              )}
            </HStack>
          );
        }}
      />
    </VStack>
  );
};

export default StorageList;

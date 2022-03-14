import { Text, FlatList, VStack, HStack } from "native-base";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { storageService } from "services";
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
  const { promiseInProgress } = usePromiseTracker({
    area: "list",
  });
  const [productArray, setProductArray] = useState<productData[]>([]);
  const [filterData, setfilterData] = useState<productData[]>([]);
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
        .catch((err) => {
          if (isSubscribed) {
            console.log(err);
          }
        }),
      "list"
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
      borderWidth={1}
      borderRadius={5}
    >
      <HStack
        borderBottomWidth={1}
        h="12"
        justifyContent="center"
        alignItems="center"
        mb="4"
      >
        <Text
          flex="1"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          รหัสสินค้า
        </Text>

        <Text
          flex="2"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          ชื่อสินค้า
        </Text>

        <Text
          flex="1"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          ราคา/หน่วย
        </Text>

        <Text
          flex="1"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          คงเหลือ/ส่วนผสม
        </Text>
      </HStack>
      <FlatList
        data={filterData == null ? productArray : filterData}
        refreshing={promiseInProgress}
        onRefresh={() => {
          fetchProductData(true);
        }}
        keyExtractor={(item: any) => item.product.prId}
        renderItem={({ item }: ListRenderItemInfo<productData>) => {
          return (
            <HStack
              key={item.product.prId}
              w="100%"
              justifyContent="center"
              alignItems="center"
              h="12"
            >
              <Text
                flex="1"
                textAlign="center"
                fontSize={{ md: "md", xl: "xl" }}
                textDecorationLine="underline"
                onPress={() => {}}
              >
                {item.product.prId}
              </Text>

              <Text
                flex="2"
                textAlign="center"
                fontSize={{ md: "md", xl: "xl" }}
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
                    flex="1"
                    textAlign="center"
                    fontSize={{ md: "md", xl: "xl" }}
                  >
                    {formattedValue}
                  </Text>
                )}
              />
              {item.product.recipeId ? (
                <Text
                  flex="1"
                  textAlign="center"
                  textDecorationLine="underline"
                  fontSize={{ md: "md", xl: "xl" }}
                >
                  ดูสูตรผสม
                </Text>
              ) : (
                <Text
                  flex="1"
                  textAlign="center"
                  fontSize={{ md: "md", xl: "xl" }}
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

import { Text, FlatList, VStack, HStack, Box } from "native-base";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { storageService } from "services";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
dayjs.extend(localizedFormat);

interface ingrData {
  id: number;
  ingrId: number;
  itemRemain: number;
  updatedAt: string;
  ingredient: {
    ingrId: number;
    ingrName: string;
    ingrUnit: string;
  };
}
const IngrList = ({ keyword }: { keyword: string }) => {
  const { promiseInProgress: loadingIngr } = usePromiseTracker({
    area: "loadingIngr",
  });
  const [ingrArray, setIngrArray] = useState<ingrData[]>([]);
  const [filterData, setfilterData] = useState<ingrData[]>([]);
  const [fetched, setFetched] = useState(false);
  const fetchProductData = async (isSubscribed: boolean) => {
    await trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            storageService
              .getAllIngrInStorage()
              .then((res) => {
                if (isSubscribed) {
                  setFetched(true);
                  const recData = res.data;
                  setIngrArray(recData);
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
        }, 500);
      }),
      "loadingIngr"
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
        const filterTable = ingrArray.filter((o: any) =>
          Object.keys(o).some((k: any) =>
            String(o[k]).toLowerCase().includes(value.toLowerCase())
          )
        );
        setfilterData(filterTable);
      };
      search(keyword);
      return () => {};
    }, [keyword, ingrArray])
  );

  return (
    <VStack w="100%" flex="12" px={4} py={2} mt="2">
      <HStack
        borderBottomWidth={1}
        h="12"
        justifyContent="center"
        alignItems="center"
        mb="4"
      >
        <Text flex="1" textAlign="center" fontWeight={600} letterSpacing="xl">
          รหัสวัตถุดิบ
        </Text>
        <Text flex="2" textAlign="center" fontWeight={600} letterSpacing="xl">
          ชื่อวัตถุดิบ
        </Text>
        <Text flex="1" textAlign="center" fontWeight={600} letterSpacing="xl">
          คงเหลือ
        </Text>
        <Text flex="2" textAlign="center" fontWeight={600} letterSpacing="xl">
          อัพเดทล่าสุด
        </Text>
      </HStack>
      <FlatList
        data={filterData == null ? ingrArray : filterData}
        refreshing={loadingIngr}
        onRefresh={() => {
          void fetchProductData(true);
        }}
        keyExtractor={(item: any) => item.ingrId}
        renderItem={({ item }: ListRenderItemInfo<ingrData>) => {
          return (
            <HStack
              key={item.ingrId}
              w="100%"
              justifyContent="center"
              alignItems="center"
              h="12"
            >
              <HStack flex="1" justifyContent="center">
                <Text textAlign="center" flex="1">
                  {item.ingrId}
                </Text>
              </HStack>
              <Text flex="2" textAlign="center">
                {item.ingredient.ingrName}
              </Text>
              <Text
                flex="1"
                textAlign="center"
                color={item.itemRemain < 20 ? "red.500" : "light.900"}
              >
                {item.itemRemain} {item.ingredient.ingrUnit}
              </Text>
              <Text flex="2" textAlign="center">
                {dayjs(item.updatedAt)
                  .locale("th")
                  .format("D MMMM YYYY เวลา HH:mm")}
              </Text>
            </HStack>
          );
        }}
      />
    </VStack>
  );
};

export default IngrList;

const styles = StyleSheet.create({
  icon: {
    marginLeft: 8,
  },
});

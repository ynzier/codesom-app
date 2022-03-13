import { Text, FlatList, VStack, HStack, Box } from "native-base";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { storageService } from "services";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
dayjs.extend(localizedFormat);

interface stuffData {
  id: number;
  stuffId: number;
  itemRemain: number;
  updatedAt: string;
  stuff: {
    stuffId: number;
    stuffName: string;
    stuffUnit: string;
  };
}
const StuffList = ({ keyword }: { keyword: string }) => {
  const { promiseInProgress } = usePromiseTracker({
    area: "list",
  });
  const [productArray, setProductArray] = useState<stuffData[]>([]);
  const [filterData, setfilterData] = useState<stuffData[]>([]);
  const fetchProductData = (isSubscribed: boolean) => {
    void trackPromise(
      storageService
        .getAllStuffInStorage()
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
          รหัสวัตถุดิบ
        </Text>
        <Text
          flex="2"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          ชื่อวัตถุดิบ
        </Text>
        <Text
          flex="1"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          คงเหลือ
        </Text>
        <Text
          flex="2"
          textAlign="center"
          fontSize={{ md: "md", xl: "xl" }}
          fontWeight={600}
          letterSpacing="xl"
        >
          อัพเดทล่าสุด
        </Text>
      </HStack>
      <FlatList
        data={filterData == null ? productArray : filterData}
        refreshing={promiseInProgress}
        onRefresh={() => {
          fetchProductData(true);
        }}
        keyExtractor={(item: any) => item.stuffId}
        renderItem={({ item }: ListRenderItemInfo<stuffData>) => {
          return (
            <HStack
              key={item.stuffId}
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
                {item.stuffId}
              </Text>
              <Text
                flex="2"
                textAlign="center"
                fontSize={{ md: "md", xl: "xl" }}
              >
                {item.stuff.stuffName}
              </Text>
              <Text
                flex="1"
                textAlign="center"
                fontSize={{ md: "md", xl: "xl" }}
              >
                {item.itemRemain} {item.stuff.stuffUnit}
              </Text>
              <Text
                flex="2"
                textAlign="center"
                fontSize={{ md: "md", xl: "xl" }}
              >
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

export default StuffList;

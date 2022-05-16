import { Text, FlatList, VStack, HStack, Box } from "native-base";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { storageService } from "services";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import StuffWithdraw from "../Modals/StuffWithdraw";
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
  const { promiseInProgress: stuffList } = usePromiseTracker({
    area: "stuffList",
  });
  const [stuffData, setStuffData] = useState<stuffData[]>([]);
  const [filterData, setfilterData] = useState<stuffData[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [fetched, setFetched] = useState(false);
  const fetchProductData = async (isSubscribed: boolean) => {
    await trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            storageService
              .getAllStuffInStorage()
              .then((res) => {
                if (isSubscribed) {
                  setFetched(true);
                  const recData = res.data;
                  setStuffData(recData);
                }
              })
              .catch((err) => {
                if (isSubscribed) {
                  console.log(err);
                }
              })
          );
        }, 500);
      }),
      "stuffList"
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
        const filterTable = stuffData.filter((o: any) =>
          Object.keys(o).some((k: any) =>
            String(o[k]).toLowerCase().includes(value.toLowerCase())
          )
        );
        setfilterData(filterTable);
      };
      search(keyword);
      return () => {};
    }, [keyword, stuffData])
  );

  return (
    <>
      {showRequest && (
        <StuffWithdraw
          showRequest={showRequest}
          setShowRequest={setShowRequest}
        />
      )}
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
          data={filterData == null ? stuffData : filterData}
          refreshing={stuffList}
          onRefresh={() => {
            void fetchProductData(true);
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
                <Text flex="1" textAlign="center">
                  {item.stuffId}
                </Text>
                <Text flex="2" textAlign="center">
                  {item.stuff.stuffName}
                </Text>
                <Text
                  flex="1"
                  textAlign="center"
                  color={item.itemRemain < 20 ? "red.500" : "light.900"}
                >
                  {item.itemRemain} {item.stuff.stuffUnit}{" "}
                  <AntDesign
                    name="export"
                    size={24}
                    color="black"
                    onPress={() => {
                      setShowRequest(true);
                    }}
                  />
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
    </>
  );
};

export default StuffList;

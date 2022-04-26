/* eslint-disable indent */
import React, { useState, useCallback, memo } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
  Divider,
  FlatList,
  View,
} from "native-base";
import { StyleSheet } from "react-native";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015

dayjs.extend(localizedFormat);

const StorageSidebarComponent = ({
  listData,
  handleFetch,
  handleShowRequest,
  handleShowDetail,
}: {
  listData: any[];
  handleFetch: () => void;
  handleShowDetail: (s: number | undefined) => void;
  handleShowRequest: () => void;
}) => {
  const { promiseInProgress: storageSidebar } = usePromiseTracker({
    area: "sidebar",
  });

  return (
    <>
      <HStack w="100%" flex="1" bg="#FFF0D9">
        <VStack w="100%" flex="1" justifyContent="center" alignItems="center">
          <Box
            flex="9"
            w="95%"
            h="100%"
            justifyContent="center"
            shadow={3}
            style={styles.flatlist}
          >
            <Text fontSize={{ md: 32, xl: 46 }} alignSelf="center">
              ประวัติคำขอ
            </Text>
            <Divider
              alignSelf="center"
              thickness="1"
              mb={4}
              width="90%"
              bg="black"
            />
            <FlatList
              data={listData}
              refreshing={storageSidebar}
              onRefresh={handleFetch}
              keyExtractor={(item: any) => item.requisitionId}
              renderItem={({ item }: any) => {
                return (
                  <View key={item.requisitionId}>
                    <Box style={styles.container}>
                      <HStack>
                        <VStack flex="1">
                          <Text fontSize={{ md: 12, xl: 16 }}>
                            เลขที่ใบเบิกสินค้า: {item.requisitionId}
                          </Text>
                        </VStack>
                        <VStack flex={{ md: 1, xl: 1 }}>
                          <Text
                            textAlign="right"
                            flex="1"
                            fontSize={{ md: 12, xl: 16 }}
                          >
                            สถานะ:{" "}
                            {item.requisitionStatus == 0
                              ? "รออนุมัติ"
                              : item.requisitionStatus == 1
                              ? "อนุมัติแล้ว"
                              : item.requisitionStatus == 2
                              ? "กำลังดำเนินการ"
                              : item.requisitionStatus == 3
                              ? "เสร็จสิ้น"
                              : "ยกเลิก"}
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack mt="1">
                        <Text flex="1" fontSize={{ md: 12, xl: 16 }}>
                          {dayjs(item.createdAt)
                            .locale("th")
                            .format("D MMMM YYYY เวลา HH:mm")}
                        </Text>
                        <Text
                          fontSize={{ md: 12, xl: 16 }}
                          style={styles.lookup}
                          onPress={() => handleShowDetail(item.requisitionId)}
                        >
                          ดูรายการ
                        </Text>
                      </HStack>
                    </Box>
                    <Divider
                      alignSelf="center"
                      thickness="1"
                      width="90%"
                      bg="light.200"
                    />
                  </View>
                );
              }}
            />
          </Box>
          {/* Bottom */}
          <Box
            flex="1"
            w="100%"
            h="100%"
            bg="#FFF0D9"
            px="4"
            alignItems="center"
          >
            <Button
              borderRadius="xl"
              colorScheme="greenalt"
              mx="4"
              w="100%"
              h="75%"
              _text={{ fontSize: 20, color: "white" }}
              onPress={handleShowRequest}
            >
              สร้างคำขอ
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};
const StorageSidebar = memo(StorageSidebarComponent);
export { StorageSidebar };

const styles = StyleSheet.create({
  container: { padding: 12, marginBottom: 2 },
  lookup: { textDecorationLine: "underline", color: "#848484" },
  flatlist: {
    margin: 16,
    padding: 8,
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#d6d3d1",
    height: "95%",
    elevation: 2,
  },
});

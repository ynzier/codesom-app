/* eslint-disable indent */
import React, { useState, useCallback } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Pressable,
  Button,
  VStack,
  Input,
  Icon,
  Divider,
  Spinner,
  FlatList,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import IconCart from "../IconCart";
import { requisitionService } from "services";
import Feather from "react-native-vector-icons/Feather";
import { RequisitionModal, RequisitionDetail } from "components";
// import AlertToast from "../AlertToast";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";

const StorageSidebar: React.FC = () => {
  const { promiseInProgress } = usePromiseTracker({
    area: "sidebar",
  });
  const [showDetail, setShowDetail] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [listData, setListData] = useState([]);
  const [reqId, setReqId] = useState(0);
  const fecthHistory = () => {
    void trackPromise(
      requisitionService
        .listReqApp()
        .then((res) => setListData(res.data))
        .catch((error) => console.log(error)),
      "sidebar"
    );
  };
  useFocusEffect(
    useCallback(() => {
      fecthHistory();

      return () => {};
    }, [])
  );

  return (
    <>
      <RequisitionModal
        showRequest={showRequest}
        setShowRequest={setShowRequest}
      />
      <RequisitionDetail
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        reqId={reqId}
      />
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
              refreshing={promiseInProgress}
              onRefresh={() => {
                fecthHistory();
              }}
              keyExtractor={(item: any) => item.requisitionId}
              renderItem={({ item }) => {
                return (
                  <>
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
                        <Text flex="1">
                          {moment(item.createdAt)
                            .local()
                            .format("DD/MM/YYYY HH:mm")}
                        </Text>
                        <Text
                          fontSize={{ md: 12, xl: 16 }}
                          style={styles.lookup}
                          onPress={() => {
                            setReqId(item.requisitionId);
                            setShowDetail(true);
                          }}
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
                  </>
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
              onPress={() => setShowRequest(true)}
            >
              สร้างคำขอ
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

export default StorageSidebar;

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

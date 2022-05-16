import React, { useState, useEffect } from "react";
import {
  StatusBar,
  Box,
  Center,
  HStack,
  VStack,
  FlatList,
  Text,
} from "native-base";
import { Navigation } from "../hooks/navigation";
import { lalamoveService } from "services";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { Ionicons } from "@expo/vector-icons";
import { DeliverySidebar, ReceiptModal } from "components";
import NumberFormat from "react-number-format";
import { Dropdown } from "ynzier-react-native-element-dropdown";

dayjs.extend(localizedFormat);

interface Props {
  route: any;
  navigation?: Navigation;
  notifCount: number;
  children?: JSX.Element;
}
interface orderData {
  key?: number;
  orderId: number;
  recipientTel: string;
  transportStatus: string;
  createTimestamp: Date;
}
const DeliveryScreen: React.FC<Props> = ({ children }) => {
  const { promiseInProgress: loadingOrders } = usePromiseTracker({
    area: "loadingOrders",
  });
  const [orderData, setOrderData] = useState<orderData[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [itemId, setItemId] = useState<string | undefined>(undefined);

  const fetchOrderList = (isMounted: boolean) => {
    void trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            lalamoveService
              .getDeliveryListApp()
              .then((res) => {
                if (isMounted) {
                  const recData = res.data;
                  setOrderData(recData);
                }
              })
              .catch((error) => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                // AlertToast(resMessage, "alert");
                Toast.show({
                  type: ALERT_TYPE.DANGER,
                  title: "พบข้อผิดพลาด!",
                  textBody: resMessage,
                });
              })
          );
        }, 500);
      }),
      "loadingOrders"
    );
  };
  const handleClose = () => {
    setItemId(undefined);
  };
  useEffect(() => {
    let isMounted = true;

    fetchOrderList(isMounted);
    return () => {
      setItemId(undefined);
      isMounted = false;
    };
  }, []);
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ReceiptModal
        showReceipt={showReceipt}
        setShowReceipt={setShowReceipt}
        orderId={orderId}
        setOrderId={setOrderId}
      />
      <Box safeAreaTop bg="coolGray.500" />
      <Center flex="1" bg="#FFF">
        <HStack w="100%" flex="1">
          <VStack w="100%" flex={{ md: "3", xl: "4" }}>
            {children}
            <VStack
              w="100%"
              flex="10"
              alignSelf="center"
              alignItems="center"
              mt="4"
              mb="82px"
              justifyContent="center"
            >
              <HStack w="100%" alignItems="center" justifyContent="center">
                <Text fontSize="xl" fontWeight={500}>
                  รายการเดลิเวอรี
                </Text>
              </HStack>
              <VStack w="100%" flex="12" px={4} py={2}>
                <HStack
                  borderBottomWidth={1}
                  h="12"
                  justifyContent="center"
                  alignItems="center"
                  mb="2"
                >
                  <Text
                    flex="1"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    ออเดอร์
                  </Text>

                  <Text
                    flex="2"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    วันที่/เวลา
                  </Text>

                  <Text
                    flex="2"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    เบอร์ผู้รับ
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    สถานะ
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    สินค้า
                  </Text>
                </HStack>
                <FlatList
                  data={orderData}
                  onRefresh={() => {
                    fetchOrderList(true);
                  }}
                  refreshing={loadingOrders}
                  keyExtractor={(item: any) => item.orderId.toString()}
                  renderItem={({ item }: ListRenderItemInfo<orderData>) => {
                    return (
                      <HStack
                        key={item.orderId.toString()}
                        w="100%"
                        justifyContent="center"
                        alignItems="center"
                        h="10"
                      >
                        <Text
                          flex="1"
                          textAlign="center"
                          textDecorationLine={"underline"}
                          onPress={() => {
                            setOrderId(item.orderId.toString());
                            setShowReceipt(true);
                          }}
                        >
                          {item.orderId}
                        </Text>
                        <Text flex="2" textAlign="center">
                          {dayjs(item.createTimestamp)
                            .locale("th")
                            .format("D MMMM YYYY เวลา HH:mm")}
                        </Text>
                        <Text flex="2" textAlign="center">
                          {item.recipientTel}
                        </Text>
                        <Text flex="1" textAlign="center">
                          {item.transportStatus}
                        </Text>
                        <Text
                          flex="1"
                          textAlign="center"
                          textDecorationLine={"underline"}
                          onPress={() => {
                            setItemId(item.orderId.toString());
                          }}
                        >
                          ดูสินค้า
                        </Text>
                      </HStack>
                    );
                  }}
                />
              </VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <DeliverySidebar itemId={itemId} handleClose={handleClose} />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default DeliveryScreen;

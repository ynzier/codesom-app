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
import { OrderSidebar } from "../components";
import { orderService } from "services";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { ReceiptModal } from "components";
import NumberFormat from "react-number-format";
import { Dropdown } from "ynzier-react-native-element-dropdown";

dayjs.extend(localizedFormat);

interface Props {
  route: any;
  navigation?: Navigation;
  children?: JSX.Element;
}
interface orderData {
  key?: number;
  orderId: number;
  branchId: number;
  orderItems: number;
  orderTotal: number;
  orderDiscount: number;
  ordTax: number;
  paidType: string;
  orderType: string;
  platformId: number;
  orderRefNo: string;
  orderStatus: string;
  createTimestamp: Date;
  receipt: { receiptTotal: number };
}
const OrderScreen: React.FC<Props> = ({ route, children }) => {
  const { promiseInProgress: loadingOrders } = usePromiseTracker({
    area: "loadingOrders",
  });
  const [orderData, setOrderData] = useState<orderData[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState("");
  const fetchOrderList = (isMounted: boolean) => {
    void trackPromise(
      orderService
        .listOrderApp()
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
        }),
      "loadingOrders"
    );
  };

  const updateOrderStatus = (updateOrderId: any, updateStatus: number) => {
    const data = {
      status: updateStatus,
      orderId: updateOrderId,
    };
    orderService
      .updateOrderStatus(data)
      .then((_res) => {
        fetchOrderList(true);
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
          title: "คำเตือน!",
          textBody: resMessage,
        });
      });
  };
  useEffect(() => {
    let isMounted = true;

    fetchOrderList(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
  const statusData = [
    { label: "กำลังดำเนินการ", value: 0 },
    { label: "เสร็จสิ้น", value: 1 },
    { label: "ยกเลิก", value: 2 },
  ];
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
              justifyContent="center"
              marginBottom={"82px"}
            >
              <HStack w="100%" alignItems="center" justifyContent="center">
                <Text fontSize="xl" fontWeight={500}>
                  ประวัติคำสั่งซื้อ
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
                    flex="1"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    ประเภท
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    ยอดเงิน
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    สถานะ
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
                    if (item.orderType == "takeaway")
                      item.orderType = "รับกลับ";
                    if (item.orderType == "delivery")
                      item.orderType = "เดลิเวอรี";
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
                          textDecorationLine={
                            item.orderStatus == "2" ? "none" : "underline"
                          }
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

                        <Text flex="1" textAlign="center">
                          {item.orderType}
                        </Text>
                        <NumberFormat
                          value={item.receipt.receiptTotal}
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
                        <Box flex="1">
                          <Dropdown
                            style={styles.inputcontainer}
                            selectedTextStyle={styles.selectedTextStyle}
                            placeholderStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            dropdownPosition="auto"
                            data={statusData}
                            search={false}
                            disable={
                              item.orderStatus == "1" || item.orderStatus == "2"
                            }
                            maxHeight={200}
                            labelField="label"
                            activeColor="#F9DCC2"
                            valueField="value"
                            value={item.orderStatus}
                            onChange={(e) => {
                              updateOrderStatus(item.orderId, e.value);
                            }}
                          />
                        </Box>
                      </HStack>
                    );
                  }}
                />
              </VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <OrderSidebar route={route.params} setOrderData={setOrderData} />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  inputcontainer: {
    borderWidth: 1,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: "center",
    borderColor: "#e7e5e4",
    height: 32,
    borderRadius: 8,
    width: "100%",
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "Prompt-Light",
  },
  selectedTextStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Prompt-Light",
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  inputStyle: { fontSize: 14, fontFamily: "Prompt-Light" },
});

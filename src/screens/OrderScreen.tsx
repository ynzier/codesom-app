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
import orderService from "../services/orders.service";
import { ListRenderItemInfo } from "react-native";
import moment from "moment";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import SelectPicker from "react-native-form-select-picker";
import ReceiptModal from "../components/ReceiptModal";

interface Props {
  route: any;
  navigation?: Navigation;
  children?: JSX.Element;
}
interface orderData {
  key?: number;
  ordId: number;
  brId: number;
  ordItems: number;
  ordTotal: number;
  ordDiscount: number;
  ordTax: number;
  paidType: string;
  ordType: string;
  platformId: number;
  ordRefNo: string;
  ordStatus: string;
  createTimestamp: Date;
}
const OrderScreen: React.FC<Props> = ({ route, children }) => {
  const [orderData, setOrderData] = useState<orderData[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [ordId, setOrdId] = useState("");
  const fetchOrderList = (isMounted: boolean) => {
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
      });
  };

  const updateOrderStatus = (updateOrdId: any, updateStatus: number) => {
    const data = {
      status: updateStatus,
      ordId: updateOrdId,
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
        ordId={ordId}
        setOrdId={setOrdId}
      />
      <Box safeAreaTop bg="coolGray.500" />
      <Center flex="1" bg="#FFF">
        <HStack w="100%" flex="1">
          <VStack w="100%" flex={{ md: "3", xl: "4" }}>
            {children}
            <VStack
              w="95%"
              flex="10"
              alignSelf="center"
              alignItems="center"
              mt="4"
              mb={{ md: "10%", xl: "6%" }}
              justifyContent="center"
            >
              <HStack
                w="100%"
                flex="1"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xl">ประวัติคำสั่งซื้อ</Text>
              </HStack>
              <VStack
                w="100%"
                flex="12"
                px={4}
                py={2}
                borderWidth={1}
                borderRadius={5}
              >
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
                    fontSize="md"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    เลขที่ใบเสร็จ
                  </Text>

                  <Text
                    flex="2"
                    textAlign="center"
                    fontSize="md"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    วันที่/เวลา
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontSize="md"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    ประเภท
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontSize="md"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    ยอดเงิน
                  </Text>

                  <Text
                    flex="1"
                    textAlign="center"
                    fontSize="md"
                    fontWeight={600}
                    letterSpacing="xl"
                  >
                    สถานะ
                  </Text>
                </HStack>
                <FlatList
                  data={orderData}
                  keyExtractor={(item: any) => item.ordId.toString()}
                  renderItem={({ item }: ListRenderItemInfo<orderData>) => {
                    if (item.ordType == "takeaway") item.ordType = "รับกลับ";
                    if (item.ordType == "delivery") item.ordType = "เดลิเวอรี่";
                    return (
                      <HStack
                        key={item.ordId.toString()}
                        w="100%"
                        justifyContent="center"
                        alignItems="center"
                        h="10"
                      >
                        <Text
                          flex="1"
                          textAlign="center"
                          fontSize="md"
                          textDecorationLine="underline"
                          onPress={() => {
                            setOrdId(item.ordId.toString());
                            setShowReceipt(true);
                          }}
                        >
                          {item.ordId}
                        </Text>

                        <Text flex="2" textAlign="center" fontSize="md">
                          {moment(item.createTimestamp)
                            .local()
                            .format("YYYY-MM-DD HH:mm")}
                        </Text>

                        <Text flex="1" textAlign="center" fontSize="md">
                          {item.ordType}
                        </Text>

                        <Text flex="1" textAlign="center" fontSize="md">
                          {item.ordTotal}
                        </Text>
                        <Box flex="1">
                          <SelectPicker
                            style={{
                              borderWidth: 1,
                              paddingTop: 0,
                              paddingBottom: 0,
                              justifyContent: "center",
                              borderColor: "#e7e5e4",
                              height: 32,
                              borderRadius: 8,
                              width: "100%",
                            }}
                            disabled={
                              item.ordStatus == "1" || item.ordStatus == "2"
                            }
                            selected={item.ordStatus}
                            onSelectedStyle={{
                              fontFamily: "Mitr-Light",
                              textAlign: "center",
                            }}
                            onValueChange={(value) => {
                              updateOrderStatus(item.ordId, value);
                            }}
                            placeholderStyle={{ fontFamily: "Mitr-Light" }}
                          >
                            <SelectPicker.Item
                              label="กำลังดำเนินการ"
                              value="0"
                            />
                            <SelectPicker.Item label="เสร็จสิ้น" value="1" />
                            <SelectPicker.Item label="ยกเลิก" value="2" />
                          </SelectPicker>
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

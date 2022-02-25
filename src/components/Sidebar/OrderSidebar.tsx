import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  HStack,
  Pressable,
  Button,
  VStack,
  Icon,
  Divider,
  FlatList,
  WarningTwoIcon,
} from "native-base";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import IconCart from "../IconCart";
import GetMoneyModal from "../GetMoneyModal";
import ordersService from "../../services/orders.service";
import AlertToast from "../AlertToast";

interface Props {
  route: any;
  fetchOrderList: () => void;
}
const OrderSidebar: React.FC<Props> = ({ route, fetchOrderList }) => {
  const { ordType, ordRefNo, platformId } = route || "";
  const [isQR, setIsQR] = useState(false);
  const [isCash, setIsCash] = useState(false);
  const [showCashModal, setCashModal] = useState(false);
  const [sumAll, setSumAll] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [totalVat, setTotalVat] = useState("0");
  const [total, setTotal] = useState("0");
  const [cartData, setCartData] = useState<any[]>();
  useEffect(() => {
    if (cartData) {
      const sum: number = cartData
        .map(
          (item: { prPrice: string; prCount: string }) =>
            parseFloat(item.prPrice) * parseInt(item.prCount)
        )
        .reduce((prev: any, curr: any) => prev + curr, 0)
        .toFixed(2);
      setSumAll(sum);
      const discount = 0.0;
      setTotalDiscount(discount.toFixed(2));
      const vat = (sum - discount) * 0.07;
      setTotalVat(vat.toFixed(2));
      setTotal((sum - discount + vat).toFixed(2));
    }
    return () => {};
  }, [cartData]);
  const fetchCartData = () => {
    AsyncStorage.getItem("cartData")
      .then((data: any) => {
        const tempCart: any = JSON.parse(data);
        setCartData(tempCart);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (!ordType) {
      AsyncStorage.removeItem("cartData")
        .then(() => {
          setCartData([]);
        })
        .catch((e) => console.log(e));
    }
    fetchCartData();

    return () => {};
  }, [ordType, route]);

  const postOrder = () => {
    let paidType;
    if (isQR) paidType = "QR";
    if (isCash) paidType = "Cash";

    const ordHeader = {
      ordItems: cartData && cartData.length,
      ordTotal: parseFloat(total).toFixed(2),
      ordDiscount: parseFloat(totalDiscount).toFixed(2),
      ordTax: parseFloat(totalVat).toFixed(2),
      paidType: paidType,
      ordType: ordType,
      platformId: platformId,
      ordRefNo: ordRefNo,
      ordStatus: "0",
    };
    const data = { ordHeader: ordHeader, ordItems: cartData };
    ordersService
      .createOrderApp(data)
      .then((_res) => {
        fetchOrderList();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        AlertToast(resMessage, "alert");
      });
  };

  return (
    <>
      <GetMoneyModal
        showModal={showCashModal}
        setShowModal={setCashModal}
        total={total}
      />
      <HStack w="100%" flex="1" bg="#FFF0D9">
        <VStack w="100%" flex="1" justifyContent="center" alignItems="center">
          <Box
            flex="1"
            margin="0"
            w="100%"
            alignItems="center"
            justifyContent="center"
            px="0"
          >
            <VStack w="100%" alignItems="center" justifyContent="center">
              <Text fontSize={{ md: 32, xl: 46 }}>สรุปรายการ</Text>
              <MaterialIcons
                style={{
                  position: "absolute",
                  right: 10,
                  top: 0,
                  fontSize: 32,
                }}
                name="cancel"
                onPress={() => {
                  AsyncStorage.removeItem("cartData")
                    .then(() => {
                      setCartData([]);
                    })
                    .catch((e) => console.log(e));
                }}
              />
            </VStack>
          </Box>
          {/** Cart Item */}
          <Divider thickness="1" mb={4} width="90%" bg="black" />
          <Box
            flex="8"
            w={{ md: "90%", xl: "90%" }}
            h="100%"
            bg="#FFFDFA"
            borderWidth={1}
            mb="4"
          >
            <Text
              my="2"
              alignSelf="center"
              fontSize={{
                md: "24",
                xl: "xl",
              }}
            >
              คำสั่งซื้อ
            </Text>
            <Divider thickness="1" mb={4} bg="black" />
            <VStack flex="5" px="4">
              <HStack flex="1" mb="2">
                <Text flex="5" fontSize={{ md: 12, xl: 18 }}>
                  รายการ
                </Text>
                <Text flex="2" textAlign="right" fontSize={{ md: 12, xl: 18 }}>
                  จำนวน
                </Text>
                <Text
                  flex="3"
                  ml="2"
                  textAlign="right"
                  fontSize={{ md: 12, xl: 18 }}
                >
                  บาท/หน่วย
                </Text>
              </HStack>
              <VStack flex="8">
                <FlatList
                  data={cartData}
                  renderItem={(data: {
                    item: {
                      key: number;
                      prName: string;
                      prPrice: number;
                      prCount: number;
                    };
                    index: string | number;
                  }) => {
                    return (
                      <Box mb="2" w="100%" flexDirection="row">
                        <Text
                          flex="5"
                          fontSize={{ md: 12, xl: 18 }}
                          noOfLines={2}
                        >
                          • {data.item.prName}
                        </Text>
                        <Text
                          textAlign="right"
                          flex="2"
                          fontSize={{ md: 12, xl: 18 }}
                        >
                          {data.item.prCount}
                        </Text>
                        <Text
                          flex="3"
                          ml="2"
                          textAlign="right"
                          fontSize={{ md: 12, xl: 18 }}
                        >
                          {data.item.prPrice.toFixed(2)}
                        </Text>
                      </Box>
                    );
                  }}
                />
              </VStack>
            </VStack>
            <Divider
              thickness="1"
              mb={4}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <VStack flex="2" px="4">
              <HStack flex="1">
                <Text flex="1" textAlign="left" fontSize={{ md: 12, xl: 18 }}>
                  ราคารวม
                </Text>
                <Text flex="2" textAlign="right" fontSize={{ md: 12, xl: 18 }}>
                  {sumAll || 0} บาท
                </Text>
              </HStack>
              <HStack flex="1">
                <Text flex="1" textAlign="left" fontSize={{ md: 12, xl: 18 }}>
                  ส่วนลด
                </Text>
                <Text flex="2" textAlign="right" fontSize={{ md: 12, xl: 18 }}>
                  {totalDiscount || 0} บาท
                </Text>
              </HStack>
              <HStack flex="1">
                <Text flex="1" textAlign="left" fontSize={{ md: 12, xl: 18 }}>
                  ภาษี 7%
                </Text>
                <Text flex="2" textAlign="right" fontSize={{ md: 12, xl: 18 }}>
                  {totalVat || 0} บาท
                </Text>
              </HStack>
            </VStack>
            <Divider
              thickness="1"
              mb={4}
              mt={2}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <HStack flex="1" px="4">
              <Text
                flex="1"
                textAlign="left"
                fontSize={{ md: 16, xl: 22 }}
                fontWeight={600}
              >
                ราคาสุทธิ
              </Text>
              <Text
                flex="2"
                textAlign="right"
                fontSize={{ md: 16, xl: 22 }}
                fontWeight={600}
              >
                {total || 0} บาท
              </Text>
            </HStack>
            <Divider
              thickness="1"
              mb={4}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <VStack flex="2.2" mb="4" justifyContent="center">
              <HStack flex="1" px="4" mb="2">
                <Text fontSize="16" fontWeight={600}>
                  เลือกวิธีการชำระเงิน
                </Text>
              </HStack>
              <HStack px="4" space={2}>
                <Pressable
                  w={{ md: "70px", xl: "100px" }}
                  h={{ md: "70px", xl: "100px" }}
                  borderRadius={100}
                  borderWidth={1}
                  borderColor="light.200"
                  justifyContent="center"
                  alignItems="center"
                  bg={isCash ? "emerald.500" : "#FFFDFA"}
                  _pressed={{
                    bg: "emerald.600",
                  }}
                  onPress={() => {
                    if (isCash) {
                      setIsCash(false);
                    } else {
                      setIsQR(false);
                      setIsCash(true);
                    }
                  }}
                >
                  {({ isPressed }) => (
                    <>
                      <Text
                        fontSize={{ md: 12, xl: 16 }}
                        color={isPressed || isCash ? "#fffdfa" : "black"}
                      >
                        เงินสด
                      </Text>
                      <Icon
                        as={Ionicons}
                        name="cash-outline"
                        size={{ md: 8, xl: 12 }}
                        color={isPressed || isCash ? "#fffdfa" : "black"}
                      />
                    </>
                  )}
                </Pressable>
                <Pressable
                  w={{ md: "70px", xl: "100px" }}
                  h={{ md: "70px", xl: "100px" }}
                  bg={isQR ? "emerald.500" : "#FFFDFA"}
                  borderRadius={100}
                  borderWidth={1}
                  borderColor="light.200"
                  justifyContent="center"
                  alignItems="center"
                  _pressed={{
                    bg: "emerald.600",
                  }}
                  onPress={() => {
                    if (isQR) {
                      setIsQR(false);
                    } else {
                      setIsCash(false);
                      setIsQR(true);
                    }
                  }}
                >
                  {({ isPressed }) => (
                    <>
                      <Text
                        fontSize={{ md: 12, xl: 16 }}
                        color={isPressed || isQR ? "#fffdfa" : "black"}
                      >
                        QR Code
                      </Text>
                      <Icon
                        as={Ionicons}
                        name="qr-code-outline"
                        size={{ md: 8, xl: 12 }}
                        color={isPressed || isQR ? "#fffdfa" : "black"}
                      />
                    </>
                  )}
                </Pressable>
              </HStack>
            </VStack>
          </Box>
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
              startIcon={<Icon as={IconCart} size={5} />}
              onPress={() => {
                if (!cartData)
                  // return AlertToast(
                  //   "เลือกสินค้าใส่ตะกร้าก่อนทำรายการ",
                  //   "alert"
                  // );
                  return Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "คำเตือน!",
                    textBody: "เลือกสินค้าใส่ตะกร้าก่อนทำรายการ",
                  });
                if (!ordType || (ordType == "delivery" && !platformId)) {
                  // AlertToast("กรุณาทำรายการอีกครั้ง", "alert");

                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "คำเตือน!",
                    textBody: "กรุณาทำรายการอีกครั้ง",
                  });
                }
                if (!isQR && !isCash)
                  // AlertToast("กรุณาเลือกวิธีการชำระเงิน", "alert");
                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "คำเตือน!",
                    textBody: "กรุณาเลือกวิธีการชำระเงิน",
                  });
                if (isCash) return setCashModal(true);
                // postOrder();
              }}
            >
              ชำระเงิน
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

export default OrderSidebar;

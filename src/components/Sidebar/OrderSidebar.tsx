import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  HStack,
  Pressable,
  Button,
  VStack,
  Icon,
  Toast,
  Divider,
  FlatList,
  WarningTwoIcon,
} from "native-base";
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
  const [showModal, setShowModal] = useState(false);
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
  useEffect(() => {
    let isSubscribed = true;
    AsyncStorage.getItem("cartData")
      .then((data: any) => {
        if (isSubscribed) {
          const tempCart: any = JSON.parse(data);
          setCartData(tempCart);
        }
      })
      .catch((e) => {
        if (isSubscribed) {
          console.log(e);
        }
      });

    return () => {
      Toast.closeAll();
      isSubscribed = false;
    };
  }, []);

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
      .then((res) => {
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
        showModal={showModal}
        setShowModal={setShowModal}
        total={total}
      />
      <HStack w="100%" flex="1" bg="#FFF0D9">
        <VStack w="100%" flex="1" justifyContent="center" alignItems="center">
          <Box
            flex="1"
            margin="0"
            w="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize={{ md: 36, xl: 48 }}>สรุปรายการ</Text>
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
                if (!ordType || (ordType == "delivery" && !platformId)) {
                  setShowModal(true);
                  AlertToast("กรุณาทำรายการอีกครั้ง", "alert");
                  return;
                }
                if (!isQR && !isCash)
                  return AlertToast("กรุณาเลือกวิธีการชำระเงิน", "alert");
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

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
  Spinner,
  FlatList,
} from "native-base";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import CashPayment from "../Modals/CashPayment";
import { orderService } from "services";
import QRPayment from "../Modals/QRPayment";
import WalletPayment from "../Modals/WalletPayment";

interface Props {
  setOrderData: (a: any) => void;
  route: any;
}
const OrderSidebar: React.FC<Props> = ({ route }) => {
  const { promiseInProgress: createDelivery } = usePromiseTracker({
    area: "createDelivery",
  });
  const { orderType, orderRefNo, platformId } = route || "";
  const [isQR, setIsQR] = useState(false);
  const [isWallet, setIsWallet] = useState(false);
  const [isCash, setIsCash] = useState(false);
  const [showCashModal, setCashModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [totalDiscount, setTotalDiscount] = useState<string>("0.00");
  const [preSendData, setPreSendData] = useState<any>([]);
  const [subTotal, setSubtotal] = useState<string>("0.00");
  const [totalVat, setTotalVat] = useState<string>("0.00");
  const [total, setTotal] = useState<string>("0.00");
  const [cartData, setCartData] = useState<any[]>();
  const [preConfirm, setPreConfirm] = useState<any[]>([]);
  const [totalIngr, setTotalIngr] = useState<any[]>([]);
  const [promoCart, setPromoCart] = useState<any>();

  useEffect(() => {
    if (cartData && cartData.length < 1) {
      setTotal("0.00");
      setTotalVat("0.00");
      setTotalDiscount("0.00");
      setSubtotal("0.00");
    }
    if (preConfirm && preConfirm.length > 0) {
      let discount = 0;
      const sum: number = preConfirm
        .map(
          (item: { productPrice: number; total: number }) =>
            item.productPrice * item.total
        )
        .reduce((prev: any, curr: any) => prev + curr, 0);
      if (promoCart.length > 0) {
        discount = promoCart
          .map(
            (item: any) =>
              item.promoCost * item.promoCount -
              item.promoPrice * item.promoCount
          )
          .reduce((prev: any, curr: any) => prev + curr, 0);
      }
      const forSumAll = sum;

      setTotalDiscount(discount.toFixed(2));
      const forTotal = sum - discount;
      setTotal(forTotal.toFixed(2));

      setSubtotal(forSumAll.toFixed(2));

      setTotalVat(
        (parseFloat(total) - (parseFloat(total) * 100) / 107).toFixed(2)
      );
    }
    return () => {};
  }, [cartData, preConfirm, promoCart, total, totalDiscount]);
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
  const fetchPreConfirm = () => {
    AsyncStorage.getItem("preConfirm")
      .then((data: any) => {
        const tempCart: any = JSON.parse(data);
        setPreConfirm(tempCart);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const fetchTotalIngr = () => {
    AsyncStorage.getItem("totalIngr")
      .then((data: any) => {
        const tempCart: any = JSON.parse(data);
        setTotalIngr(tempCart);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchPromoCart = () => {
    AsyncStorage.getItem("promoCart")
      .then((data: any) => {
        const tempCart: any = JSON.parse(data);
        if (tempCart) setPromoCart(tempCart);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (!orderType) {
      AsyncStorage.removeItem("cartData")
        .then(() => {
          setCartData([]);
        })
        .catch((e) => console.log(e));

      AsyncStorage.removeItem("promoCart")
        .then(() => {
          setPromoCart([]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    setPromoCart([]);
    setPreConfirm([]);
    setCartData([]);
    setTotalIngr([]);
    fetchCartData();
    fetchPreConfirm();
    fetchPromoCart();
    fetchTotalIngr();

    return () => {};
  }, [orderType, route]);

  const postOrder = () => {
    const ordHeader: any = {
      orderItems: cartData && cartData.length,
      orderTotal: parseFloat(total).toFixed(2),
      orderDiscount: parseFloat(totalDiscount).toFixed(2),
      orderSubTotal: parseFloat(subTotal.toString()).toFixed(2),
      orderType: orderType,
      platformId: platformId,
      orderRefNo: orderRefNo,
      orderStatus: "0",
    };
    const data = {
      ordHeader: ordHeader,
      orderItems: preConfirm,
      totalIngr: totalIngr,
      orderPromo: promoCart,
    };
    setPreSendData(data);
    setCashModal(true);
  };
  const postQROrder = () => {
    const ordHeader: any = {
      orderItems: cartData && cartData.length,
      orderTotal: parseFloat(total).toFixed(2),
      orderDiscount: parseFloat(totalDiscount).toFixed(2),
      orderSubTotal: parseFloat(subTotal.toString()).toFixed(2),
      orderType: orderType,
      platformId: null,
      orderRefNo: null,
      orderStatus: "0",
    };
    const data = {
      ordHeader: ordHeader,
      orderItems: preConfirm,
      totalIngr: totalIngr,
      orderPromo: promoCart,
    };

    setPreSendData(data);
    setShowQRModal(true);
  };

  const postWalletOrder = () => {
    const ordHeader: any = {
      orderItems: cartData && cartData.length,
      orderTotal: parseFloat(total).toFixed(2),
      orderDiscount: parseFloat(totalDiscount).toFixed(2),
      orderSubTotal: parseFloat(subTotal.toString()).toFixed(2),
      orderType: orderType,
      platformId: null,
      orderRefNo: null,
      orderStatus: "0",
    };
    const data = {
      ordHeader: ordHeader,
      orderItems: preConfirm,
      totalIngr: totalIngr,
      orderPromo: promoCart,
    };
    setPreSendData(data);
    setShowWalletModal(true);
  };
  const createOrderDelivery = () => {
    const ordHeader: any = {
      orderItems: cartData && cartData.length,
      orderTotal: parseFloat(total).toFixed(2),
      orderDiscount: parseFloat(totalDiscount).toFixed(2),
      orderSubTotal: parseFloat(subTotal.toString()).toFixed(2),
      orderType: orderType,
      platformId: platformId,
      orderRefNo: orderRefNo,
      orderStatus: "0",
    };
    const data = {
      ordHeader: ordHeader,
      orderItems: preConfirm,
      totalIngr: totalIngr,
      orderPromo: promoCart,
    };

    const pushData = {
      total: parseFloat(total).toFixed(2),
      cash: parseFloat(total).toFixed(2),
      tax: (parseFloat(total) * 0.07).toFixed(2),
      net: (parseFloat(total) * 0.07).toFixed(2),
      change: "0.0",
    };
    const sendData = { orderData: data, receiptData: pushData };
    void trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            orderService
              .createOrderDelivery(sendData)
              .then((res) => {
                resetStorage();
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  textBody: res.data.message,
                });
                setPreSendData([]);
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
        }, 2000);
      }),
      "createDelivery"
    );
  };
  const handleCancel = async () => {
    setIsCash(false);
    setIsQR(false);
    setIsWallet(false);
    try {
      await AsyncStorage.removeItem("cartData").then(() => {
        setCartData([]);
      });
      await AsyncStorage.removeItem("promoCart").then(() => {
        setPromoCart([]);
      });
      await AsyncStorage.removeItem("totalIngr").then(() => {
        setTotalIngr([]);
      });
      await AsyncStorage.removeItem("preConfirm").then(() => {
        setPreConfirm([]);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const resetStorage = () => {
    try {
      void AsyncStorage.removeItem("cartData").then(() => {
        setCartData([]);
      });
      void AsyncStorage.removeItem("promoCart").then(() => {
        setPromoCart([]);
      });
      void AsyncStorage.removeItem("totalIngr").then(() => {
        setTotalIngr([]);
      });
      void AsyncStorage.removeItem("preConfirm").then(() => {
        setPreConfirm([]);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {showCashModal && (
        <CashPayment
          showModal={showCashModal}
          setShowModal={setCashModal}
          preSendData={preSendData}
          setPreSendData={setPreSendData}
          totalVat={totalVat}
          isCash={isCash}
          setIsCash={setIsCash}
          orderTotal={parseFloat(total).toFixed(2)}
          resetStorage={resetStorage}
        />
      )}
      {showQRModal && (
        <QRPayment
          showModal={showQRModal}
          setShowModal={setShowQRModal}
          resetStorage={resetStorage}
          preSendData={preSendData}
          setPreSendData={setPreSendData}
          totalVat={totalVat}
          isQR={isQR}
          setIsQR={setIsQR}
          orderTotal={parseFloat(total).toFixed(2)}
        />
      )}
      {showWalletModal && (
        <WalletPayment
          showModal={showWalletModal}
          setShowModal={setShowWalletModal}
          preSendData={preSendData}
          setPreSendData={setPreSendData}
          resetStorage={resetStorage}
          totalVat={totalVat}
          isWallet={isWallet}
          setIsWallet={setIsWallet}
          orderTotal={parseFloat(total).toFixed(2)}
        />
      )}
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
            <HStack
              w="100%"
              h="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontSize={24}
                fontWeight={600}
                flex="1"
                textAlign={"center"}
              >
                สรุปรายการ
              </Text>
              <MaterialIcons
                size={18}
                style={{ position: "absolute", top: 8, right: 12 }}
                name="cancel"
                onPress={() => {
                  void handleCancel();
                }}
              />
            </HStack>
          </Box>
          {/** Cart Item */}
          <Divider thickness="1" mb={4} width="90%" bg="black" />
          <Box
            flex="10"
            w={{ md: "90%", xl: "90%" }}
            h="100%"
            bg="#FFFDFA"
            borderWidth={1}
            borderColor="light.300"
            mb="4"
          >
            <Text my="2" alignSelf="center" fontWeight={600}>
              คำสั่งซื้อ
            </Text>
            <Divider thickness="1" mb={4} bg="gray.300" />
            <VStack flex="5" px="4">
              <HStack flex="1" mb="2">
                <Text flex="4" fontWeight={600}>
                  รายการ
                </Text>
                <Text flex="2" ml="2" textAlign="right" fontWeight={600}>
                  บาท/หน่วย
                </Text>
              </HStack>
              <VStack flex="8">
                {preConfirm && (
                  <FlatList
                    data={preConfirm}
                    keyExtractor={(item: any) => item.productId}
                    renderItem={(data: any) => (
                      <Box mb="2" w="100%" flexDirection="row">
                        <Text flex="5" noOfLines={1}>
                          • {data.item.productName}
                        </Text>
                        <Text textAlign="right" flex="1">
                          x{data.item.total}
                        </Text>
                        <Text flex="3" textAlign="right">
                          {data.item.productPrice.toFixed(2)}
                        </Text>
                      </Box>
                    )}
                  />
                )}
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
                <Text flex="1" textAlign="left" fontWeight={600}>
                  ราคารวม
                </Text>
                <Text flex="2" textAlign="right" fontWeight={600}>
                  {subTotal} บาท
                </Text>
              </HStack>
              <HStack flex="1">
                <Text flex="1" textAlign="left" fontWeight={600}>
                  ส่วนลด
                </Text>
                <Text flex="2" textAlign="right" fontWeight={600}>
                  {totalDiscount} บาท
                </Text>
              </HStack>
              <HStack flex="1">
                <Text flex="1" textAlign="left" fontWeight={600}>
                  ภาษี 7%
                </Text>
                <Text flex="2" textAlign="right" fontWeight={600}>
                  {totalVat} บาท
                </Text>
              </HStack>
            </VStack>
            <Divider
              thickness="1"
              mt={2}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <HStack flex="1" h="100%" px="4" alignItems="center">
              <Text flex="1" textAlign="left" fontWeight={600}>
                ราคาสุทธิ
              </Text>
              <Text flex="2" textAlign="right" fontWeight={600}>
                {total || 0} บาท
              </Text>
            </HStack>
            <Divider
              thickness="1"
              mb={2}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <VStack flex="2.2" mb="4" justifyContent="center">
              <HStack flex="1" px="4" mb="2">
                <Text fontWeight={600}>เลือกวิธีการชำระเงิน</Text>
              </HStack>
              <HStack px="12px" justifyContent={"space-between"}>
                <Pressable
                  w={70}
                  h={70}
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
                      setIsWallet(false);
                      setIsCash(true);
                    }
                  }}
                >
                  {({ isPressed }) => (
                    <>
                      <Text
                        fontSize={12}
                        color={isPressed || isCash ? "#fffdfa" : "black"}
                      >
                        เงินสด
                      </Text>
                      <Icon
                        as={Ionicons}
                        name="cash-outline"
                        size={6}
                        color={isPressed || isCash ? "#fffdfa" : "black"}
                      />
                    </>
                  )}
                </Pressable>
                <Pressable
                  w={70}
                  h={70}
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
                      setIsWallet(false);
                      setIsQR(true);
                    }
                  }}
                >
                  {({ isPressed }) => (
                    <>
                      <Text
                        fontSize={12}
                        color={isPressed || isQR ? "#fffdfa" : "black"}
                      >
                        QR Code
                      </Text>
                      <Icon
                        as={Ionicons}
                        name="qr-code-outline"
                        size={6}
                        color={isPressed || isQR ? "#fffdfa" : "black"}
                      />
                    </>
                  )}
                </Pressable>
                <Pressable
                  w={70}
                  h={70}
                  bg={isWallet ? "emerald.500" : "#FFFDFA"}
                  borderRadius={100}
                  borderWidth={1}
                  borderColor="light.200"
                  justifyContent="center"
                  alignItems="center"
                  _pressed={{
                    bg: "emerald.600",
                  }}
                  onPress={() => {
                    if (isWallet) {
                      setIsWallet(false);
                    } else {
                      setIsCash(false);
                      setIsQR(false);
                      setIsWallet(true);
                    }
                  }}
                >
                  {({ isPressed }) => (
                    <>
                      <Text
                        color={isPressed || isWallet ? "#fffdfa" : "black"}
                        fontSize={12}
                      >
                        Wallet
                      </Text>
                      <Icon
                        as={Ionicons}
                        name="wallet-outline"
                        size={6}
                        color={isPressed || isWallet ? "#fffdfa" : "black"}
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
              colorScheme="emerald"
              mx="4"
              w="100%"
              h="75%"
              leftIcon={
                <FontAwesome name="shopping-basket" size={20} color="white" />
              }
              onPress={() => {
                if (!cartData)
                  return Toast.show({
                    type: ALERT_TYPE.DANGER,
                    textBody: "เลือกสินค้าใส่ตะกร้าก่อนทำรายการ",
                  });
                if (
                  orderType == "delivery" &&
                  !(
                    platformId == "1" ||
                    platformId == "2" ||
                    platformId == "3" ||
                    platformId == "4" ||
                    platformId == "0"
                  )
                ) {
                  return Toast.show({
                    type: ALERT_TYPE.DANGER,
                    textBody: "ข้อมูลเดลิเวอรีไม่ถูกต้อง กรุณาทำรายการอีกครั้ง",
                  });
                }

                if (orderType == "delivery") {
                  if (
                    platformId == "0" ||
                    platformId == "1" ||
                    platformId == "2" ||
                    platformId == "3" ||
                    platformId == "4"
                  )
                    return createOrderDelivery();
                }
                if (!isQR && !isCash && !isWallet)
                  return Toast.show({
                    type: ALERT_TYPE.DANGER,
                    textBody: "กรุณาเลือกวิธีการชำระเงิน",
                  });
                if (isCash) {
                  postOrder();
                }
                if (isQR) {
                  postQROrder();
                }
                if (isWallet) postWalletOrder();
              }}
            >
              {createDelivery ? (
                <Spinner size="sm" color="altred.500" />
              ) : (
                "ชำระเงิน"
              )}
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

export default OrderSidebar;

import React, { useState, useCallback } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
  Icon,
  Divider,
  Spinner,
} from "native-base";
import NumericInput from "react-native-numeric-input";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import IconCart from "../IconCart";
import Feather from "react-native-vector-icons/Feather";
// import AlertToast from "../AlertToast";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { storageService } from "services";
import CartCheckOut from "../Modals/CartCheckOut";
import NumberFormat from "react-number-format";

type Props = {
  cartData: any;
  setCartData: (value: any) => void;
  promoCart?: any;
  setPromoCart: (value: any) => void;
};

const CartSidebar: React.FC<Props> = ({
  cartData,
  setCartData,
  promoCart,
  setPromoCart,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [sumAll, setSumAll] = useState("0");
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [total, setTotal] = useState("0");

  const handleCompleteCart = async () => {
    const cart: any[] = cartData;
    if (cartData == "" && promoCart == "")
      return Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "คำเตือน!",
        textBody: "กรุณาเลือกสินค้าก่อนทำรายการ",
      });

    try {
      await trackPromise(
        new Promise((resolve) => {
          resolve(
            storageService
              .checkRecipeCartAvailable({ cartData, promoCart })
              .then((res) => {
                void AsyncStorage.setItem(
                  "preConfirm",
                  JSON.stringify(res.data.totalProductName)
                );
                void AsyncStorage.setItem(
                  "totalIngr",
                  JSON.stringify(res.data.totalIngr)
                );
              })
          );
          if (promoCart.length > 0)
            resolve(
              AsyncStorage.setItem("promoCart", JSON.stringify(promoCart))
            );
          resolve(AsyncStorage.setItem("cartData", JSON.stringify(cart)));
        }),
        "setCart"
      );
      setShowModal(true);
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: resMessage,
      });
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (cartData) {
        const sum: number = cartData
          .map(
            (item: { productPrice: number; quantity: number }) =>
              item.productPrice * item.quantity
          )
          .reduce((prev: any, curr: any) => prev + curr, 0);
        const sumPromo: number = promoCart
          .map((item: any) => item.promoCost * item.promoCount)
          .reduce((prev: any, curr: any) => prev + curr, 0);
        const sumPromoPrice: number = promoCart
          .map((item: any) => item.promoPrice * item.promoCount)
          .reduce((prev: any, curr: any) => prev + curr, 0);
        const discount = promoCart
          .map(
            (item: any) =>
              item.promoCost * item.promoCount -
              item.promoPrice * item.promoCount
          )
          .reduce((prev: any, curr: any) => prev + curr, 0);

        const forSumAll = sum + sumPromo;
        setSumAll(forSumAll.toFixed(2));

        setTotalDiscount(discount.toFixed(2));
        const forTotal = sum + sumPromoPrice;
        setTotal(forTotal.toFixed(2));
      }
      return () => {};
    }, [cartData, promoCart])
  );

  const closeRow = (
    rowMap: { [x: string]: { closeRow: () => void } },
    rowKey: string | number
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...cartData];
    const prevIndex = cartData.findIndex(
      (item: { key: any }) => item.key === rowKey
    );
    newData.splice(prevIndex, 1);
    setCartData(newData);
  };

  const deletePromo = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...promoCart];
    const prevIndex = promoCart.findIndex((item: { key: any }) => {
      return item.key === rowKey;
    });
    newData.splice(prevIndex, 1);
    setPromoCart(newData);
  };

  const renderItem = (
    data: {
      item: {
        key: number;
        productId: number;
        productName: string;
        productPrice: string;
        quantity: number;
        needProcess: number | null;
      };
      index: string | number;
    },
    rowMap: any
  ) => (
    <SwipeRow
      disableRightSwipe
      rightOpenValue={-60}
      previewOpenValue={-40}
      previewRepeatDelay={3000}
    >
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(rowMap, data.item.key)}
        >
          <Feather name="trash-2" color="#000" size={32} />
        </TouchableOpacity>
      </View>
      <Box
        borderWidth="0"
        borderRadius="18"
        bg="altred.500"
        px="5"
        py="2"
        mx="4"
        my="1"
      >
        <HStack space={3} justifyContent="center">
          <VStack w="100%" flex="6" mr="0">
            <Text
              fontFamily="mono"
              fontWeight={600}
              fontSize={{
                md: "lg",
                xl: "xl",
              }}
              color="#FFF"
              numberOfLines={1}
            >
              {data.item.productName}
            </Text>
            <Text
              fontFamily="mono"
              fontWeight={400}
              color="#FFF"
              numberOfLines={1}
            >
              {data.item.productPrice} บาท/รายการ
            </Text>
          </VStack>
          <Box justifyContent={"center"} alignItems={"center"}>
            <NumericInput
              value={data.item.quantity}
              onChange={(value) => {
                setCartData(
                  Object.values({
                    ...cartData,
                    [data.index]: {
                      ...cartData[data.index],
                      quantity: value,
                    },
                  })
                );
              }}
              onLimitReached={(isMax) => {
                if (isMax)
                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "คำเตือน!",
                    textBody: "ถึงจำนวนสูงสุดแล้ว",
                  });
              }}
              totalWidth={100}
              totalHeight={40}
              minValue={1}
              maxValue={99}
              initValue={data.item.quantity}
              step={1}
              valueType="integer"
              rounded
              textColor={"white"}
              separatorWidth={1}
            />
          </Box>
        </HStack>
      </Box>
    </SwipeRow>
  );

  const renderHiddenPromoItem = (
    data: { item: { key: any; [s: string]: any } },
    rowMap: any
  ) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deletePromo(rowMap, data.item.key)}
      >
        <Feather name="trash-2" color="#000" size={32} />
      </TouchableOpacity>
    </View>
  );

  const CartLoader = () => {
    const { promiseInProgress: settingCart } = usePromiseTracker({
      area: "setCart",
    });
    return settingCart ? (
      <Spinner size="lg" color="cream" />
    ) : (
      <Text color="white" fontSize={20}>
        ชำระเงิน
      </Text>
    );
  };
  return (
    <>
      {showModal && (
        <CartCheckOut
          showModal={showModal}
          setCartData={setCartData}
          setPromoCart={setPromoCart}
          setShowModal={setShowModal}
        />
      )}
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
            <Text fontSize={{ md: 32, xl: 46 }}>รายการ</Text>
            <Text fontSize={{ md: 32, xl: 46 }} marginLeft="10">
              {cartData.length}
            </Text>
          </Box>
          {/** Cart Item */}
          <Divider thickness="1" mb={4} width="90%" bg="black" />
          <Box flex="5" w="100%" h="100%" justifyContent="center">
            {!cartData.length ? (
              <Text alignSelf="center" fontSize={20} color="#837B7F">
                ไม่มีรายการสินค้า
              </Text>
            ) : (
              <>
                <SwipeListView
                  data={cartData}
                  renderItem={renderItem}
                  keyExtractor={(item: any) => item.key}
                />
              </>
            )}
          </Box>
          <Box flex="3" w="100%" h="100%" justifyContent="center">
            {promoCart[0] == null ? (
              <Text alignSelf="center" fontSize={20} color="#837B7F">
                ไม่มีโปรโมชันที่เลือก
              </Text>
            ) : (
              <>
                <Text
                  mb="4"
                  ml="4"
                  fontSize={20}
                  fontWeight={600}
                  color="coolGray.800"
                >
                  โปรโมชัน
                </Text>
                <SwipeListView
                  data={promoCart}
                  renderItem={({ item }: { item: any }) => (
                    <HStack
                      borderWidth="0"
                      borderRadius="18"
                      bg="altred.500"
                      px="5"
                      py="2"
                      mx="4"
                      my="1"
                    >
                      <Text
                        flex="2"
                        fontSize="18px"
                        fontWeight={600}
                        color="coolGray.200"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.promoName}
                      </Text>
                      <Box mb="2">
                        <NumberFormat
                          value={item.promoPrice}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          fixedDecimalScale
                          renderText={(formattedValue) => (
                            <Text
                              fontFamily="mono"
                              fontWeight={400}
                              color="#FFF"
                              numberOfLines={1}
                              textAlign="right"
                              flex="1"
                            >
                              {formattedValue}.-
                            </Text>
                          )}
                        />
                        <Text
                          fontFamily="mono"
                          fontWeight={400}
                          color="#FFF"
                          numberOfLines={1}
                          textAlign="right"
                          flex="1"
                        >
                          {item.promoCount} รายการ
                        </Text>
                      </Box>
                    </HStack>
                  )}
                  renderHiddenItem={renderHiddenPromoItem}
                  rightOpenValue={-60}
                  previewRowKey={"0"}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                  keyExtractor={(item) => item.key}
                />
              </>
            )}
          </Box>
          <Box flex="2" w={{ md: "90%", xl: "80%" }} h="100%">
            <Divider thickness="1" mb={3} width="100%" bg="black" />
            <VStack>
              <HStack>
                <Text
                  flex="1"
                  textAlign="left"
                  fontSize="18px"
                  fontWeight={600}
                >
                  ราคารวม
                </Text>
                <Text
                  flex="2"
                  textAlign="right"
                  fontSize="18px"
                  fontWeight={600}
                >
                  {sumAll} บาท
                </Text>
              </HStack>
              <HStack>
                <Text
                  flex="1"
                  textAlign="left"
                  fontSize="18px"
                  fontWeight={600}
                >
                  ส่วนลด
                </Text>
                <Text
                  flex="2"
                  textAlign="right"
                  fontSize="18px"
                  fontWeight={600}
                >
                  {totalDiscount} บาท
                </Text>
              </HStack>
              <HStack>
                <Text
                  flex="1"
                  textAlign="left"
                  fontSize="18px"
                  fontWeight={600}
                >
                  ราคาสุทธิ
                </Text>
                <Text
                  flex="2"
                  textAlign="right"
                  fontSize="18px"
                  fontWeight={600}
                >
                  {total} บาท
                </Text>
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
              startIcon={<Icon as={IconCart} size={5} />}
              onPress={() => {
                void handleCompleteCart();
              }}
            >
              <CartLoader />
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};
const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    flex: 1,
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "red",
  },
  backRightBtnRight: {
    alignItems: "flex-end",
    backgroundColor: "red",
    borderRadius: 24,
    right: 16,
    paddingRight: 16,
  },
});

export default CartSidebar;

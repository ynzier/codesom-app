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
  Spacer,
} from "native-base";
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
  const [storageData, setStorageData] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (cartData) {
        storageService
          .getRemainOnlyProductId()
          .then((res) => setStorageData(res.data))
          .catch((error) => console.log(error));
        const sum: number = cartData
          .map(
            (item: { prPrice: number; prCount: number; promoId: number }) =>
              !item.promoId && item.prPrice * item.prCount
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

  const deletePromo = (rowMap: any, rowKey: any, promoId: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...promoCart];
    const prevIndex = promoCart.findIndex((item: { key: any }) => {
      return item.key === rowKey;
    });
    newData.splice(prevIndex, 1);
    setPromoCart(newData);

    const newCart = cartData.filter(
      (e: { promoId: any }) => e.promoId != promoId
    );
    setCartData(newCart);
  };

  const renderItem = (
    data: {
      item: {
        key: number;
        prId: number;
        prName: string;
        prPrice: string;
        prCount: number;
        needProcess: number | null;
        promoId: number | null;
      };
      index: string | number;
    },
    rowMap: any
  ) => (
    <SwipeRow
      disableLeftSwipe={data.item.promoId ? true : false}
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
              {data.item.prName}
            </Text>
            <Text
              fontFamily="mono"
              fontWeight={400}
              color="#FFF"
              numberOfLines={1}
            >
              {data.item.prPrice} บาท/รายการ
            </Text>
          </VStack>
          <Box
            flex="5"
            h="10"
            mt="1"
            justifyContent="center"
            borderWidth={1}
            borderRadius="24px"
            borderColor="#FFFDFA"
            alignItems="center"
            flexDirection="row"
          >
            <Box h="100%" flex="1" alignItems="center" justifyContent="center">
              <Pressable
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={data.item.promoId ? true : false}
                onPress={() => {
                  if (data.item.prCount - 1 > 0) {
                    let temp = data.item.prCount;
                    temp = temp - 1;

                    setCartData(
                      Object.values({
                        ...cartData,
                        [data.index]: {
                          ...cartData[data.index],
                          prCount: temp,
                        },
                      })
                    );
                  }
                }}
              >
                <Text
                  color="#FFF"
                  display={data.item.promoId ? "none" : "flex"}
                >
                  -
                </Text>
              </Pressable>
            </Box>
            <Box
              h="100%"
              flex="2"
              borderLeftWidth={data.item.promoId ? 0 : 1}
              borderRightWidth={data.item.promoId ? 0 : 1}
              borderColor="#FFFDFA"
              alignSelf="center"
              justifyContent="center"
            >
              <Input
                keyboardType={Platform.OS === "ios" ? "phone-pad" : "numeric"}
                fontSize="14"
                textAlign="center"
                color="#FFF"
                alignSelf="center"
                borderWidth="0"
                isReadOnly={data.item.promoId ? true : false}
                value={data.item.prCount.toString()}
                onChangeText={(text) => {
                  const onlyDigits = text.replace(/\D/g, "");
                  let prCount: number = parseInt(onlyDigits);
                  if (text == "") prCount = 1;
                  const checkIndex = storageData.findIndex(
                    (product: any) => product.productId === data.item.prId
                  );
                  const max: number = storageData[checkIndex].itemRemain;
                  if (prCount <= max || data.item.needProcess)
                    setCartData(
                      Object.values({
                        ...cartData,
                        [data.index]: {
                          ...cartData[data.index],
                          prCount: prCount,
                        },
                      })
                    );
                }}
              />
            </Box>
            <Box flex="1" h="100%" alignItems="center" justifyContent="center">
              <Pressable
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={data.item.promoId ? true : false}
                onPress={() => {
                  let temp = data.item.prCount;
                  temp = temp + 1;
                  const checkIndex = storageData.findIndex(
                    (product: any) => product.productId === data.item.prId
                  );
                  const max: number = storageData[checkIndex].itemRemain;
                  if (temp <= max || data.item.needProcess) {
                    setCartData(
                      Object.values({
                        ...cartData,
                        [data.index]: {
                          ...cartData[data.index],
                          prCount: temp,
                        },
                      })
                    );
                  } else {
                    Toast.show({
                      type: ALERT_TYPE.DANGER,
                      title: "คำเตือน!",
                      textBody: "สินค้าเหลือเพียง " + max + " ชิ้น",
                    });
                  }
                }}
              >
                <Text
                  color="#FFF"
                  display={data.item.promoId ? "none" : "flex"}
                >
                  +
                </Text>
              </Pressable>
            </Box>
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
        onPress={() => deletePromo(rowMap, data.item.key, data.item.promoId)}
      >
        <Feather name="trash-2" color="#000" size={32} />
      </TouchableOpacity>
    </View>
  );

  const CartLoader = () => {
    const { promiseInProgress } = usePromiseTracker({ area: "setCart" });
    return promiseInProgress ? (
      <Spinner size="lg" color="cream" />
    ) : (
      <Text color="white" fontSize={20}>
        ชำระเงิน
      </Text>
    );
  };
  return (
    <>
      <CartCheckOut
        showModal={showModal}
        setCartData={setCartData}
        setPromoCart={setPromoCart}
        setShowModal={setShowModal}
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
            <Text fontSize={{ md: 32, xl: 46 }}>รายการ</Text>
            <Text fontSize={{ md: 32, xl: 46 }} marginLeft="10">
              {cartData.length}
            </Text>
          </Box>
          {/** Cart Item */}
          <Divider thickness="1" mb={4} width="90%" bg="black" />
          <Box flex="5" w="100%" h="100%" justifyContent="center">
            {cartData[0] == null ? (
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
                  renderItem={({
                    item,
                  }: {
                    item: {
                      key: number | string;
                      promoName: string;
                      promoPrice: number | string;
                      promoCount: number;
                    };
                  }) => (
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
              onPress={async () => {
                const cart: any[] = cartData;
                if (cartData == "" && promoCart == "")
                  return Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "คำเตือน!",
                    textBody: "กรุณาเลือกสินค้าก่อนทำรายการ",
                  });
                const needProcess = cartData.filter(
                  (obj: any) => obj.needProcess
                );
                let available = true;
                let ingrList: any[] = [];
                if (needProcess.length > 0) {
                  await storageService
                    .checkRecipeCartAvailable(needProcess)
                    .then((res) => {
                      ingrList = res.data.totalIngr;
                    })
                    .catch((error) => {
                      const resMessage =
                        (error.response &&
                          error.response.data &&
                          error.response.data.message) ||
                        error.message ||
                        error.toString();
                      available = false;
                      return Toast.show({
                        type: ALERT_TYPE.DANGER,
                        textBody: resMessage,
                      });
                    });
                }
                if (available) {
                  await AsyncStorage.removeItem("cartData").catch((e) => {
                    console.log(e);
                  });
                  await AsyncStorage.removeItem("promoCart").catch((e) => {
                    console.log(e);
                  });
                  await AsyncStorage.removeItem("totalIngrCart").catch((e) => {
                    console.log(e);
                  });
                  await trackPromise(
                    new Promise((resolve, _reject) => {
                      setTimeout(() => {
                        if (promoCart.length > 0) {
                          resolve(
                            AsyncStorage.setItem(
                              "promoCart",
                              JSON.stringify(promoCart)
                            )
                          );
                        }
                        if (ingrList.length > 0) {
                          resolve(
                            AsyncStorage.setItem(
                              "cartData",
                              JSON.stringify(cart)
                            )
                          );
                          resolve(
                            AsyncStorage.setItem(
                              "totalIngrCart",
                              JSON.stringify(ingrList)
                            ).then(() => {
                              setShowModal(true);
                            })
                          );
                        } else
                          resolve(
                            AsyncStorage.setItem(
                              "cartData",
                              JSON.stringify(cart)
                            ).then(() => {
                              setShowModal(true);
                            })
                          );
                      }, 500);
                    }),
                    "setCart"
                  );
                }
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

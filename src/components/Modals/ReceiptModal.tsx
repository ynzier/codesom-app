import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Center,
  Box,
  ScrollView,
  Spinner,
} from "native-base";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { branchService, orderService } from "services";
dayjs.extend(localizedFormat);
type IBranchObj = {
  branchId: number | null;
  branchName: string;
  branchAddr: string;
  branchTel: string;
  branchStatus: string;
  branchImg: string;
};

const ReceiptModal = ({
  showReceipt,
  setShowReceipt,
  orderId,
  setOrderId,
  setShowModal,
}: {
  showReceipt: boolean;
  setShowReceipt: (boolean: boolean) => void;
  orderId: string;
  setOrderId: (any: string) => void;
  setShowModal?: (any: boolean) => void;
  props?: any;
}) => {
  const { promiseInProgress: loadingReceipt } = usePromiseTracker({
    area: "loadingReceipt",
  });
  const [branchData, setBranchData] = useState<IBranchObj>({} as IBranchObj);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [receiptData, setReceiptData] = useState<any>({});

  const handleClose = () => {
    setShowReceipt(false);
    if (setShowModal) setShowModal(false);
    setOrderItems([]);
    setReceiptData({});

    setOrderId("");
  };

  useEffect(() => {
    if (orderId != "") {
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              branchService
                .getCurrentBranchWithOutImage()
                .then((res) => {
                  setBranchData(res.data);
                })
                .catch((e) => {
                  console.log(e);
                })
            );
            resolve(
              orderService
                .getReceiptByOrderId(orderId)
                .then((res) => {
                  const receiveData = res.data;
                  setOrderItems(receiveData.orderItems);
                  setReceiptData(receiveData.receipt);
                })
                .catch((error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  console.log(error);
                  Toast.show({
                    type: ALERT_TYPE.DANGER,
                    textBody: resMessage,
                  });
                })
            );
          }, 2000);
        }),
        "loadingReceipt"
      );
    }

    return () => {
      setReceiptData({});
      setOrderItems([]);
    };
  }, [orderId]);

  return (
    <Center>
      <Modal isOpen={showReceipt} onClose={handleClose} size="lg">
        <Modal.Content h="700" maxWidth="450" justifyContent="center">
          {loadingReceipt ? (
            <Spinner size="lg" color="cream" />
          ) : (
            <>
              <Modal.CloseButton />
              <Modal.Header mx="4" borderBottomWidth={1} alignItems="center">
                <Text fontSize="lg">ใบเสร็จ</Text>
              </Modal.Header>
              <Modal.Body py={4}>
                <ScrollView minH="400">
                  <Box borderWidth={1} pt={4} mx="4" w="400" alignSelf="center">
                    <HStack justifyContent="center" alignItems="center">
                      <Text
                        fontSize="md"
                        fontWeight={600}
                        flex="1"
                        textAlign="center"
                      >
                        CODESOM
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text
                        fontSize="md"
                        fontWeight={600}
                        flex="1"
                        textAlign="center"
                      >
                        {branchData.branchName || ""}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignSelf="center" mx="2">
                      <Text flex="1" textAlign="center" numberOfLines={2}>
                        {branchData.branchAddr || ""}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text flex="1" textAlign="center">
                        เบอร์โทรศัพท์: {branchData.branchTel || ""}
                      </Text>
                    </HStack>
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      px={4}
                      mb={4}
                    >
                      <Text
                        ellipsizeMode="clip"
                        numberOfLines={1}
                        letterSpacing={1}
                      >
                        --------------------------------------------------------------------------------
                      </Text>
                    </HStack>
                    {orderItems &&
                      orderItems.map(
                        (
                          item: {
                            key: number;
                            product: { productName: string };
                            productPrice: number;
                            quantity: number;
                          },
                          index: any
                        ) => (
                          <VStack key={index} justifyContent="center">
                            <HStack px="8">
                              <VStack flex="1">
                                <Text flex="1" numberOfLines={1}>
                                  {item.product.productName}
                                </Text>
                              </VStack>
                              <VStack flex="1">
                                <NumberFormat
                                  value={item.productPrice * item.quantity}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalScale={2}
                                  fixedDecimalScale
                                  renderText={(formattedValue) => (
                                    <Text textAlign="right">
                                      {formattedValue} บาท
                                    </Text>
                                  )}
                                />
                              </VStack>
                            </HStack>
                            <HStack>
                              <VStack px={10}>
                                <Text flex="1">
                                  {item.quantity} x {}
                                  <NumberFormat
                                    value={item.productPrice}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    fixedDecimalScale
                                    decimalScale={2}
                                    renderText={(formattedValue) => (
                                      <Text textAlign="right">
                                        {formattedValue} บาท
                                      </Text>
                                    )}
                                  />
                                </Text>
                              </VStack>
                            </HStack>
                          </VStack>
                        )
                      )}
                    <VStack justifyContent="center">
                      <HStack px="8">
                        <VStack flex="1">
                          <Text flex="1">ส่วนลด</Text>
                        </VStack>

                        <NumberFormat
                          value={receiptData?.receiptDiscount}
                          displayType={"text"}
                          thousandSeparator={true}
                          decimalScale={2}
                          fixedDecimalScale
                          renderText={(formattedValue) => (
                            <Text textAlign="right">{formattedValue} บาท</Text>
                          )}
                        />
                      </HStack>
                    </VStack>
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      px="4"
                      mt="4"
                    >
                      <Text
                        ellipsizeMode="clip"
                        numberOfLines={1}
                        letterSpacing={1}
                      >
                        --------------------------------------------------------------------------------
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontWeight={600} flex="1" textAlign="right">
                        ราคารวม :
                      </Text>
                      <NumberFormat
                        value={receiptData.receiptNet}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={(formattedValue) => (
                          <Text fontWeight={600} textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontWeight={600} flex="1" textAlign="right">
                        ภาษี (7%) :
                      </Text>
                      <NumberFormat
                        value={receiptData.receiptTax}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={(formattedValue) => (
                          <Text fontWeight={600} textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack
                      justifyContent="center"
                      alignSelf="flex-end"
                      px="4"
                      w="50%"
                    >
                      <Text
                        ellipsizeMode="clip"
                        flex="1"
                        numberOfLines={1}
                        letterSpacing={1}
                        textAlign="right"
                      >
                        ---------------------------------
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontWeight={600} flex="1" textAlign="right">
                        ราคาสุทธิ :
                      </Text>
                      <NumberFormat
                        value={receiptData.receiptTotal}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={(formattedValue) => (
                          <Text fontWeight={600} textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack
                      justifyContent="center"
                      alignSelf="flex-end"
                      px="4"
                      w="50%"
                    >
                      <Text
                        ellipsizeMode="clip"
                        flex="1"
                        numberOfLines={2}
                        letterSpacing={1}
                        textAlign="right"
                        lineHeight="xs"
                      >
                        -------------------------------------------------
                      </Text>
                    </HStack>
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      px="4"
                      mt="4"
                    >
                      <Text
                        ellipsizeMode="clip"
                        numberOfLines={1}
                        letterSpacing={1}
                      >
                        --------------------------------------------------------------------------------
                      </Text>
                    </HStack>
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      mx="8"
                      mt="4"
                    >
                      <Text fontWeight={600} flex="1" textAlign="right">
                        เงินสด :
                      </Text>
                      <NumberFormat
                        value={receiptData.receiptCash}
                        displayType={"text"}
                        thousandSeparator={true}
                        fixedDecimalScale
                        decimalScale={2}
                        renderText={(formattedValue) => (
                          <Text fontWeight={600} textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontWeight={600} flex="1" textAlign="right">
                        เงินทอน :
                      </Text>
                      <NumberFormat
                        value={receiptData.receiptChange}
                        displayType={"text"}
                        thousandSeparator={true}
                        fixedDecimalScale
                        decimalScale={2}
                        renderText={(formattedValue) => (
                          <Text fontWeight={600} textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mt="8">
                      <Text flex="1" textAlign="center">
                        เลขที่ใบเสร็จ {receiptData.receiptId}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mb="8">
                      <Text flex="1" textAlign="center">
                        {dayjs(receiptData.recTimestamp)
                          .locale("th")
                          .format("D MMMM YYYY เวลา HH:mm")}
                      </Text>
                    </HStack>
                  </Box>
                </ScrollView>
              </Modal.Body>
              <Modal.Footer bg="transparent">
                <Button
                  flex="1"
                  colorScheme="emerald"
                  onPress={() => {
                    setShowReceipt(false);
                    if (setShowModal) setShowModal(false);
                  }}
                >
                  เสร็จสิ้น
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default ReceiptModal;

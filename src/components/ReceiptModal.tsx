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
import moment from "moment";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import branchService from "../services/branch.service";
import ordersService from "../services/orders.service";

type IBranchObj = {
  brId: number | null;
  brName: string;
  brAddr: string;
  brTel: string;
  brStatus: string;
  brImg: string;
};

const ReceiptModal = ({
  showReceipt,
  setShowReceipt,
  ordId,
  setOrdId,
}: {
  showReceipt: boolean;
  setShowReceipt: (boolean: boolean) => void;
  ordId: string;
  setOrdId: (any: string) => void;
  props?: any;
}) => {
  const { promiseInProgress } = usePromiseTracker();
  const [branchData, setBranchData] = useState<IBranchObj>({} as IBranchObj);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [receiptData, setReceiptData] = useState<any>({});

  useEffect(() => {
    if (ordId != "") {
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
              ordersService
                .getReceiptByOrderId(ordId)
                .then((res) => {
                  const receiveData = res.data;
                  setOrderItems(receiveData.orderItems);
                  setReceiptData(receiveData.receipt);
                })
                .catch((e) => console.log(e))
            );
          }, 2000);
        })
      );
    }

    return () => {
      setOrdId("");
    };
  }, [ordId, setOrdId]);

  return (
    <Center>
      <Modal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        size="lg"
      >
        <Modal.Content h="700" maxWidth="450" justifyContent="center">
          {promiseInProgress ? (
            <Spinner size="lg" color="cream" />
          ) : (
            <>
              <Modal.CloseButton />
              <Modal.Header mx="4" borderBottomWidth={1} alignItems="center">
                <Text fontSize="lg">ใบเสร็จ</Text>
              </Modal.Header>
              <Modal.Body h="550">
                <ScrollView minH="400">
                  <Box borderWidth={1} mx="4" w="400" alignSelf="center">
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      mt={6}
                      mb="2"
                    >
                      <Text fontSize="lg" flex="1" textAlign="center">
                        CODESOM
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        {branchData.brName || ""}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignSelf="center" mx="2">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        {branchData.brAddr || ""}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        เบอร์โทรศัพท์: {branchData.brTel || ""}
                      </Text>
                    </HStack>
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      px="4"
                      mb={4}
                    >
                      <Text
                        ellipsizeMode="clip"
                        numberOfLines={1}
                        fontSize="lg"
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
                            prName: string;
                            prPrice: number;
                            prCount: number;
                          },
                          index: any
                        ) => (
                          <VStack key={index} justifyContent="center">
                            <HStack px="8">
                              <VStack flex="1">
                                <Text fontSize="lg" flex="1">
                                  {item.product.prName}
                                </Text>
                              </VStack>
                              <VStack flex="1">
                                <NumberFormat
                                  value={item.prPrice * item.prCount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  decimalScale={2}
                                  fixedDecimalScale
                                  renderText={(formattedValue) => (
                                    <Text
                                      fontSize="lg"
                                      textAlign="right"
                                      flex="1"
                                    >
                                      {formattedValue} บาท
                                    </Text>
                                  )}
                                />
                              </VStack>
                            </HStack>
                            <HStack>
                              <VStack px={10}>
                                <Text fontWeight="light" fontSize="lg" flex="1">
                                  {item.prCount} x {}
                                  <NumberFormat
                                    value={item.prPrice}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    fixedDecimalScale
                                    decimalScale={2}
                                    renderText={(formattedValue) => (
                                      <Text
                                        fontSize="lg"
                                        textAlign="right"
                                        flex="1"
                                      >
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
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                      px="4"
                      mt="4"
                    >
                      <Text
                        ellipsizeMode="clip"
                        numberOfLines={1}
                        fontSize="lg"
                        letterSpacing={1}
                      >
                        --------------------------------------------------------------------------------
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontSize="lg" flex="1" textAlign="right">
                        ราคารวม :
                      </Text>
                      <NumberFormat
                        value={receiptData.total - receiptData.tax}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={(formattedValue) => (
                          <Text fontSize="lg" textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontSize="lg" flex="1" textAlign="right">
                        ภาษี (7%) :
                      </Text>
                      <NumberFormat
                        value={receiptData.tax}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={(formattedValue) => (
                          <Text fontSize="lg" textAlign="right" flex="1">
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
                        fontSize="md"
                        letterSpacing={1}
                        textAlign="right"
                      >
                        ---------------------------------
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontSize="lg" flex="1" textAlign="right">
                        ราคาสุทธิ :
                      </Text>
                      <NumberFormat
                        value={receiptData.total}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale
                        renderText={(formattedValue) => (
                          <Text fontSize="lg" textAlign="right" flex="1">
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
                        fontSize="md"
                        letterSpacing={1}
                        textAlign="right"
                        lineHeight="xs"
                      >
                        -------------------------------------------
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
                        fontSize="lg"
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
                      <Text fontSize="lg" flex="1" textAlign="right">
                        เงินสด :
                      </Text>
                      <NumberFormat
                        value={receiptData.cash}
                        displayType={"text"}
                        thousandSeparator={true}
                        fixedDecimalScale
                        decimalScale={2}
                        renderText={(formattedValue) => (
                          <Text fontSize="lg" textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mx="8">
                      <Text fontSize="lg" flex="1" textAlign="right">
                        เงินทอน :
                      </Text>
                      <NumberFormat
                        value={receiptData.change}
                        displayType={"text"}
                        thousandSeparator={true}
                        fixedDecimalScale
                        decimalScale={2}
                        renderText={(formattedValue) => (
                          <Text fontSize="lg" textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mt="8">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        เลขที่ใบเสร็จ {receiptData.receiptId}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mb="8">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        {moment(receiptData.recTimestamp)
                          .local()
                          .format("DD/MM/YYYY HH:mm:ss")}
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

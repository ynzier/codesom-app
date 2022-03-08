import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Center,
  Box,
  Input,
  AlertDialog,
  Spinner,
  Collapse,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VirtualKeyboard from "react-native-virtual-keyboard";
import NumberFormat from "react-number-format";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { orderService, receiptService } from "services";
import ReceiptModal from "./ReceiptModal";

const GetMoneyModal = ({
  showModal,
  setShowModal,
  fetchCartData,
  cartData,
  setCartData,
  preSendData,
  setPreSendData,
  isCash,
  totalVat,
  ordTotal,
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  fetchCartData: () => void;
  cartData: any;
  setCartData: (a: any) => void;
  preSendData: any;
  setPreSendData: (a: any) => void;
  totalVat: any;
  isCash: any;
  ordTotal: any;
  props?: any;
}) => {
  const [finishState, setFinishState] = useState(false);
  const [receiptData, setReceiptData] = useState<any>([]);
  const { promiseInProgress } = usePromiseTracker();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isDone, setIsDone] = useState(false);
  const [total, setTotal] = useState("0");
  const [change, setChange] = useState("0");
  const [vat, setVat] = useState("0");
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
  const [cash, setCash] = useState("0");
  const [tip, setTip] = useState("0");
  const [showReceipt, setShowReceipt] = useState(false);

  const checkInput = (e: React.SetStateAction<number>) => {
    const data = e.toString();
    const thoudsandSeperator = parseFloat(data).toFixed(2);
    setCash(thoudsandSeperator);
  };
  const isEnough = (needed: number, paid: number) => {
    if (paid - needed >= 0) {
      return true;
    }
    return false;
  };
  const onSuccess = () => {
    AsyncStorage.removeItem("cartData")
      .then(() => {
        setCartData([]);
      })
      .catch((e) => console.log(e));
    fetchCartData();
    onSubPrompteceipt();
  };
  const createOrder = () => {
    void trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            orderService
              .createOrderApp(preSendData)
              .then((res) => {
                setReceiptData({
                  ordHeader: preSendData.ordHeader,
                  ordItems: cartData,
                  ordId: res.data.orderId,
                  ordVat: totalVat,
                  paidType: isCash && "cash",
                });
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
      })
    );
    setPreSendData([]);
  };

  const onSubPrompteceipt = () => {
    const pushData = {
      paidType: receiptData.paidType,
      total: total,
      cash: cash,
      tip: tip,
      tax: vat,
      change: change,
    };
    void trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            receiptService
              .createReceipt({
                receiptData: pushData,
                ordId: receiptData.ordId,
              })
              .then((res) => {
                setFinishState(true);
                setIsDone(true);
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
        }, 1000);
      })
    );
  };

  useEffect(() => {
    if (isConfirm) {
      setTotal(parseFloat(ordTotal.toString()).toFixed(2));
      const remain = parseFloat(cash) - parseFloat(total) - parseFloat(tip);
      setChange(parseFloat(remain.toString()).toFixed(2));
      setVat(receiptData.ordVat);
    }
    return () => {};
  }, [cash, isConfirm, ordTotal, receiptData.ordVat, tip, total]);
  return (
    <Center>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsConfirm={setIsConfirm}
        createOrder={createOrder}
      />
      <NotEnoughAlert isAlertOpen={isAlertOpen} setAlertOpen={setAlertOpen} />
      <Modal
        avoidKeyboard
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsConfirm(false);
          setCash("0");
        }}
        size="lg"
      >
        <Modal.Content maxWidth="500">
          {!isConfirm && <Modal.CloseButton />}
          <Modal.Header mx="4" borderBottomWidth={1} alignItems="center">
            <Text fontSize="lg">{!isConfirm ? "เงินสด" : "บันทึกยอด"}</Text>
          </Modal.Header>
          <Modal.Body _scrollview={{ scrollEnabled: false }} mt="2">
            {!isConfirm ? (
              <>
                <Box justifyContent="center" w="full" h="20" px="8">
                  <Text flex="1" fontSize={16} color="gray.500">
                    กรอกจำนวนเงินที่ได้รับ
                  </Text>
                  <NumberFormat
                    value={cash}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={2}
                    fixedDecimalScale
                    renderText={(formattedValue) => (
                      <Text fontSize={32} textAlign="right">
                        {formattedValue}
                      </Text>
                    )}
                  />
                </Box>
                <Box>
                  <VirtualKeyboard
                    color="gray"
                    decimal
                    clearOnLongPress
                    pressMode="string"
                    onPress={(val: React.SetStateAction<number>) =>
                      checkInput(val)
                    }
                    cellStyle={{ height: 80 }}
                  />
                  <Button
                    colorScheme="emerald"
                    onPress={() => {
                      if (isEnough(ordTotal, parseFloat(cash))) setIsOpen(true);
                      else setAlertOpen(true);
                    }}
                  >
                    ยืนยัน
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <VStack
                  mx="8"
                  mt="2"
                  mb="8"
                  borderWidth={1}
                  borderRadius={4}
                  borderColor="gray.500"
                >
                  <HStack
                    h="60px"
                    bg="gray.300"
                    justifyContent="center"
                    alignItems="center"
                    px="4"
                    borderTopRadius={4}
                  >
                    <Text fontSize="lg" flex="1">
                      จ่ายเงินสด
                    </Text>
                    <Text fontSize="lg" textAlign="right" flex="1">
                      เลขที่ออเดอร์: {receiptData.ordId}
                    </Text>
                  </HStack>
                  <Collapse isOpen={!isDone}>
                    <VStack mt={4} mb={8} space={4} px={4}>
                      <HStack justifyContent="center" alignItems="center">
                        <Text fontSize="lg" flex="1">
                          ได้รับเงิน
                        </Text>
                        <NumberFormat
                          value={cash}
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
                      <HStack justifyContent="center" alignItems="center">
                        <Text fontSize="lg" flex="1">
                          ราคาสุทธิ
                        </Text>
                        <NumberFormat
                          value={total}
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
                      <HStack justifyContent="center" alignItems="center">
                        <Text fontSize="lg" flex="1">
                          ทิป
                        </Text>
                        <Input
                          flex="1"
                          textAlign="right"
                          fontSize="lg"
                          value={tip}
                          isDisabled={isDone}
                          onChangeText={(e) => setTip(e)}
                          rightElement={<Text fontSize="lg">บาท</Text>}
                        />
                      </HStack>
                      <HStack justifyContent="center" alignItems="center">
                        <Text fontSize="lg" flex="1">
                          เงินทอน
                        </Text>
                        <NumberFormat
                          value={change}
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
                    </VStack>
                  </Collapse>
                  <VStack mt={4} mb={8} space={4} px={4}>
                    {isDone ? (
                      <Button
                        size="lg"
                        colorScheme="altred"
                        variant="subtle"
                        onPress={() => {
                          setShowReceipt(true);
                        }}
                      >
                        พิมพ์ใบเสร็จ
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        colorScheme="emerald"
                        onPress={() => {
                          onSuccess();
                        }}
                      >
                        {promiseInProgress ? (
                          <Spinner size="sm" color="cream" />
                        ) : (
                          "เสร็จสิ้น"
                        )}
                      </Button>
                    )}
                  </VStack>
                </VStack>
              </>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {finishState && (
        <ReceiptModal
          showReceipt={showReceipt}
          setShowReceipt={setShowReceipt}
          ordId={receiptData.ordId}
        />
      )}
    </Center>
  );
};
const NotEnoughAlert = ({
  isAlertOpen,
  setAlertOpen,
}: {
  isAlertOpen: boolean;
  setAlertOpen: (any: boolean) => void;
}) => {
  const close = () => {
    setAlertOpen(false);
  };

  const cancelRef = useRef(null);
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAlertOpen}
        onClose={close}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>แจ้งเตือน</AlertDialog.Header>
          <AlertDialog.Body>ยอดเงินที่กรอกไม่เพียงพอ</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button colorScheme="rose" onPress={close}>
                รับทราบ
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};
const ConfirmDialog = ({
  isOpen,
  setIsOpen,
  setIsConfirm,
  createOrder,
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  setIsConfirm: (any: boolean) => void;
  createOrder: () => void;
}) => {
  const onClose = () => {
    setIsOpen(false);
  };
  const onConfirm = () => {
    createOrder();
    setIsOpen(false);
    setIsConfirm(true);
  };

  const cancelRef = useRef(null);
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>ยืนยัน</AlertDialog.Header>
          <AlertDialog.Body>
            ตรวจสอบจำนวนเงินที่ได้รับก่อนทำการยืนยัน
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                ยกเลิก
              </Button>
              <Button colorScheme="emerald" onPress={onConfirm}>
                ตกลง
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default GetMoneyModal;

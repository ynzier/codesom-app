import React, { useState, useRef } from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Center,
  Box,
  AlertDialog,
  Spinner,
} from "native-base";
import VirtualKeyboard from "react-native-virtual-keyboard";
import NumberFormat from "react-number-format";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { orderService } from "services";
import ReceiptModal from "./ReceiptModal";

const CashPayment = ({
  showModal,
  setShowModal,
  preSendData,
  setPreSendData,
  isCash,
  setIsCash,
  totalVat,
  orderTotal,
  resetStorage,
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  preSendData: any;
  setPreSendData: (a: any) => void;
  totalVat: any;
  isCash: any;
  setIsCash: (value: boolean) => void;
  orderTotal: any;
  resetStorage: () => void;
  props?: any;
}) => {
  const [finishState, setFinishState] = useState(false);
  const [orderId, setOrderId] = useState<any>("");
  const { promiseInProgress: loadingTransaction } = usePromiseTracker({
    area: "loadingTransaction",
  });
  const [totalValue, setTotalValue] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
  const [cash, setCash] = useState("0");
  const [showReceipt, setShowReceipt] = useState(false);

  const checkInput = (e: React.SetStateAction<number>) => {
    const data = e.toString();
    const thoudsandSeperator = parseFloat(data).toFixed(2);
    setCash(thoudsandSeperator);
  };
  const isEnough = (needed: number, paid: number) => {
    return paid - needed >= 0;
  };
  const createOrder = () => {
    setTotalValue(orderTotal);
    const pushData = {
      paidType: isCash && "cash",
      total: parseFloat(orderTotal).toFixed(2),
      cash: parseFloat(cash).toFixed(2),
      tax: parseFloat(totalVat).toFixed(2),
      net: (orderTotal - totalVat).toFixed(2),
      change: (parseFloat(cash) - orderTotal).toFixed(2),
    };
    const sendData = { orderData: preSendData, receiptData: pushData };
    void trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            orderService
              .createOrderApp(sendData)
              .then((res) => {
                setOrderId(res.data.orderId);

                resetStorage();

                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  textBody: res.data.message,
                });
                setIsCash(false);
                setIsOpen(false);
                setIsConfirm(true);
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
      "loadingTransaction"
    );
  };

  return (
    <Center>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createOrder={createOrder}
        loadingTransaction={loadingTransaction}
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
          {(finishState || !isConfirm) && <Modal.CloseButton />}
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
                      if (isEnough(orderTotal, parseFloat(cash)))
                        setIsOpen(true);
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
                    {!loadingTransaction && (
                      <Text fontSize="lg" textAlign="right" flex="1">
                        เลขที่ออเดอร์: {orderId}
                      </Text>
                    )}
                  </HStack>
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
                        value={totalValue}
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
                        เงินทอน
                      </Text>
                      <NumberFormat
                        value={(
                          parseFloat(cash) - parseFloat(totalValue)
                        ).toFixed(2)}
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
                  <VStack mt={4} mb={8} space={4} px={4}>
                    <Button
                      size="lg"
                      colorScheme="altred"
                      variant="subtle"
                      disabled={loadingTransaction}
                      onPress={() => {
                        setFinishState(true);
                        setShowReceipt(true);
                      }}
                    >
                      {loadingTransaction ? (
                        <Spinner size="sm" color="altred.500" />
                      ) : (
                        "พิมพ์ใบเสร็จ"
                      )}
                    </Button>
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
          orderId={orderId}
          setOrderId={setOrderId}
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
  createOrder,
  loadingTransaction,
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  createOrder: () => void;
  loadingTransaction: boolean;
}) => {
  const onClose = () => {
    setIsOpen(false);
  };
  const onConfirm = () => {
    createOrder(); /////// <<<<<
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
                {loadingTransaction ? (
                  <Spinner size="sm" color="altred.500" />
                ) : (
                  "ตกลง"
                )}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default CashPayment;

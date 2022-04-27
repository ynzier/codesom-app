import React, { useState, useRef, useEffect } from "react";
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
  Image,
  Pressable,
  Collapse,
  Divider,
} from "native-base";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NumberFormat from "react-number-format";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { orderService } from "services";
import ReceiptModal from "./ReceiptModal";

const Shopee = ({
  setError,
  wallet,
  setWallet,
}: {
  setError: (arg0: string) => void;
  wallet: string;
  setWallet: (arg0: string) => void;
}) => {
  return (
    <Pressable
      w="100"
      bg={wallet === "shopee" ? "orange.500" : "#FFFDFA"}
      _pressed={{
        bg: "orange.700",
      }}
      h="100"
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderRadius={8}
      borderColor="gray.400"
      flexDirection="column-reverse"
      onPress={() => {
        setError("");
        setWallet("shopee");
      }}
    >
      {({ isPressed }) => (
        <>
          <Text color={isPressed || wallet === "shopee" ? "#fffdfa" : "black"}>
            Shopee
          </Text>
          <Image
            alt="Shopee"
            width="60"
            h="60"
            tintColor={wallet === "shopee" ? "light.100" : "orange.500"}
            source={require("../../assets/shopee.png")}
          />
        </>
      )}
    </Pressable>
  );
};
const Dolphin = ({
  setError,
  wallet,
  setWallet,
}: {
  setError: (arg0: string) => void;
  wallet: string;
  setWallet: (arg0: string) => void;
}) => {
  return (
    <Pressable
      w="100"
      bg={wallet === "dolphin" ? "emerald.500" : "#FFFDFA"}
      _pressed={{
        bg: "emerald.600",
      }}
      h="100"
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderRadius={8}
      borderColor="gray.400"
      flexDirection="column-reverse"
      onPress={() => {
        setError("");
        setWallet("dolphin");
      }}
    >
      {({ isPressed }) => (
        <>
          <Text color={isPressed || wallet === "dolphin" ? "#fffdfa" : "black"}>
            Dolphin
          </Text>
          <Image
            alt="dolphin"
            width="60"
            h="60"
            source={require("../../assets/dolphin.png")}
          />
        </>
      )}
    </Pressable>
  );
};
const WalletPayment = ({
  showModal,
  setShowModal,
  preSendData,
  setPreSendData,
  isWallet,
  setIsWallet,
  orderTotal,
  resetStorage,
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  preSendData: any;
  setPreSendData: (a: any) => void;
  totalVat: any;
  isWallet: any;
  setIsWallet: (value: boolean) => void;
  orderTotal: any;
  resetStorage: () => void;
  props?: any;
}) => {
  const [finishState, setFinishState] = useState(false);
  const [orderId, setOrderId] = useState<any>("");
  const { promiseInProgress: createWalletOrder } = usePromiseTracker({
    area: "createWalletOrder",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [wallet, setWallet] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [error, setError] = useState<string>("");

  const createOrder = () => {
    const pushData = {
      paidType: wallet,
      total: orderTotal,
      cash: orderTotal,
      tax: (orderTotal * 0.07).toFixed(2),
      net: (orderTotal * 0.07).toFixed(2),
      change: "0.0",
    };
    const sendData = { orderData: preSendData, receiptData: pushData };
    void trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            orderService
              .createOrderEwallet(sendData)
              .then((res) => {
                setOrderId(res.data.orderId);
                resetStorage();
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  textBody: res.data.message,
                });
                setIsWallet(false);
                setWallet("");
                setPreSendData([]);
                setIsOpen(false);
                setFinishState(true);
                setShowReceipt(true);
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
      "createWalletOrder"
    );
  };

  return (
    <Center>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        createOrder={createOrder}
        createWalletOrder={createWalletOrder}
      />
      <Modal
        avoidKeyboard
        isOpen={showModal && !(finishState && showReceipt)}
        onClose={() => {
          setWallet("");
          setShowModal(false);
        }}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header mx="4" borderBottomWidth={0} alignItems="center">
            E-Wallet
          </Modal.Header>
          <Modal.Body _scrollview={{ scrollEnabled: false }}>
            <VStack>
              <NumberFormat
                value={orderTotal}
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale
                renderText={(formattedValue) => (
                  <Text
                    fontWeight={400}
                    fontSize={{ md: 12, xl: 18 }}
                    flexWrap="wrap"
                    textAlign={"center"}
                  >
                    ยอดทั้งหมด: {formattedValue} บาท
                  </Text>
                )}
              />
              <HStack space="3">
                <Box
                  alignItems="flex-end"
                  shadow="4"
                  zIndex={4}
                  flex="1"
                  h="100%"
                  w="100%"
                >
                  <Shopee
                    setError={setError}
                    wallet={wallet}
                    setWallet={setWallet}
                  />
                </Box>
                <Box flex="1" shadow="4" zIndex={4} h="100%" w="100%">
                  <Dolphin
                    setError={setError}
                    wallet={wallet}
                    setWallet={setWallet}
                  />
                </Box>
              </HStack>
            </VStack>
            <Divider my="4" />
            <Button
              isDisabled={wallet === ""}
              colorScheme="success"
              _disabled={{ backgroundColor: "gray.400" }}
              onPress={() => {
                if (isWallet != "") {
                  setIsOpen(true);
                } else {
                  setError("กรุณาเลือกแพลตฟอร์มก่อน");
                }
              }}
            >
              ต่อไป
            </Button>
            <Collapse my={2} isOpen={error ? true : false}>
              <Text color="danger.400">*{error}</Text>
            </Collapse>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {finishState && (
        <ReceiptModal
          showReceipt={showReceipt}
          setShowReceipt={setShowReceipt}
          orderId={orderId}
          setOrderId={setOrderId}
          setShowModal={setShowModal}
        />
      )}
    </Center>
  );
};

const ConfirmDialog = ({
  isOpen,
  setIsOpen,
  createOrder,
  createWalletOrder,
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  createOrder: () => void;
  createWalletOrder: boolean;
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
                {createWalletOrder ? (
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

export default WalletPayment;

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
} from "native-base";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NumberFormat from "react-number-format";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { orderService } from "services";
import ReceiptModal from "./ReceiptModal";

const QRPayment = ({
  showModal,
  setShowModal,
  fetchCartData,
  setCartData,
  preSendData,
  setPreSendData,
  setTotalIngr,
  fetchTotalIngr,
  isQR,
  setIsQR,
  ordTotal,
  setPromoCart,
  fetchPromoCart,
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  fetchCartData: () => void;
  fetchTotalIngr: () => void;
  cartData: any;
  setCartData: (a: any) => void;
  preSendData: any;
  setPreSendData: (a: any) => void;
  totalVat: any;
  isQR: any;
  setIsQR: (value: boolean) => void;
  ordTotal: any;
  props?: any;
  setTotalIngr: (value: any) => void;
  setPromoCart: (value: any) => void;
  fetchPromoCart: () => void;
}) => {
  const [finishState, setFinishState] = useState(false);
  const [orderId, setOrderId] = useState<any>("");
  const { promiseInProgress } = usePromiseTracker();
  const [omiseNet, setOmiseNet] = useState(0);
  const [chrgId, setChrgId] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [base64, setBase64] = useState("");
  const [breaker, setBreaker] = useState(0);
  useEffect(() => {
    const getQR = async () => {
      await orderService
        .getQR({ orderData: preSendData, amount: ordTotal })
        .then((res) => {
          setOmiseNet(res.data.net / 100);
          setChrgId(res.data.chrgId);
          setBase64(res.data.base64);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (ordTotal && !finishState) {
      void trackPromise(getQR());
    }

    return () => {};
  }, [finishState, ordTotal, preSendData]);

  useEffect(() => {
    const createOrder = () => {
      if (breaker == 1) {
        const pushData = {
          chrgId: chrgId,
          paidType: isQR && "qr",
          total: omiseNet.toFixed(2),
          cash: omiseNet.toFixed(2),
          tax: (omiseNet * 0.07).toFixed(2),
          net: (omiseNet - omiseNet * 0.07).toFixed(2),
          change: "0.0",
        };
        const sendData = { orderData: preSendData, receiptData: pushData };
        void trackPromise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(
                orderService
                  .createOrderOmise(sendData)
                  .then((res) => {
                    setOrderId(res.data.orderId);
                    AsyncStorage.removeItem("cartData")
                      .then(() => {
                        setCartData([]);
                      })
                      .catch((e) => console.log(e));
                    AsyncStorage.removeItem("totalIngr")
                      .then(() => {
                        setTotalIngr([]);
                      })
                      .catch((e) => console.log(e));
                    AsyncStorage.removeItem("promoCart")
                      .then(() => {
                        setPromoCart([]);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                    fetchPromoCart();
                    fetchCartData();
                    fetchTotalIngr();
                    Toast.show({
                      type: ALERT_TYPE.SUCCESS,
                      textBody: res.data.message,
                    });
                    setIsQR(false);
                    setBase64("");
                    setChrgId("");
                    setOmiseNet(0);
                    setPreSendData([]);
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
          })
        );
      }
    };
    const checkStatus = setInterval(() => {
      if (base64 != "" && chrgId != "")
        if (breaker == 0) {
          orderService
            .checkCompleteCharge(chrgId)
            .then((res) => {
              if (res.data.message == "successful") {
                setBreaker(breaker + 1);
              }
            })
            .catch((error) => {
              let resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              clearInterval(checkStatus);
              if (resMessage == "payment rejected")
                resMessage = "การชำระเงินถูกปฏิเสธ";
              Toast.show({
                type: ALERT_TYPE.DANGER,
                textBody: resMessage,
              });
              setShowModal(false);
            });
        }
      if (breaker == 1 && !finishState) {
        clearInterval(checkStatus);
        createOrder();
      }
    }, 2000);
    return () => {
      clearInterval(checkStatus);
    };
  }, [
    base64,
    breaker,
    chrgId,
    fetchCartData,
    fetchPromoCart,
    fetchTotalIngr,
    finishState,
    isQR,
    omiseNet,
    preSendData,
    setCartData,
    setIsQR,
    setPreSendData,
    setPromoCart,
    setShowModal,
    setTotalIngr,
  ]);

  return (
    <Center>
      <Modal
        avoidKeyboard
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Modal.Content minW={"100%"} minH={"100%"} alignItems="center">
          <Modal.CloseButton />
          <Modal.Header mx="4" borderBottomWidth={1} alignItems="center">
            <Text fontSize="lg">Thai QR</Text>
          </Modal.Header>
          <Modal.Body>
            {promiseInProgress ? (
              <Box
                h="100%"
                w="100%"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Spinner size={"lg"} color="cream" />
              </Box>
            ) : (
              <Box>
                <NumberFormat
                  value={ordTotal}
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
                {base64 && (
                  <Image
                    alt="QRCode"
                    source={{ uri: base64 }}
                    width={300}
                    height={500}
                  />
                )}
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {finishState && (
        <ReceiptModal
          showReceipt={showReceipt}
          setShowReceipt={setShowReceipt}
          ordId={orderId}
          setOrdId={setOrderId}
        />
      )}
    </Center>
  );
};

export default QRPayment;

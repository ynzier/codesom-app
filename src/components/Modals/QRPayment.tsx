import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Center,
  Box,
  Spinner,
  Image,
} from "native-base";

import NumberFormat from "react-number-format";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { orderService } from "services";
import ReceiptModal from "./ReceiptModal";

const QRPayment = ({
  showModal,
  setShowModal,
  preSendData,
  setPreSendData,
  isQR,
  setIsQR,
  orderTotal,
  resetStorage,
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  preSendData: any;
  setPreSendData: (a: any) => void;
  totalVat: any;
  resetStorage: () => void;
  isQR: any;
  setIsQR: (value: boolean) => void;
  orderTotal: any;
  props?: any;
}) => {
  const [finishState, setFinishState] = useState(false);
  const [orderId, setOrderId] = useState<any>("");
  const { promiseInProgress } = usePromiseTracker();
  const [omiseNet, setOmiseNet] = useState(0);
  const [chrgId, setChrgId] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [base64, setBase64] = useState("");
  const [breaker, setBreaker] = useState(0);
  const [fetchQR, setFetchQR] = useState(false);
  useEffect(() => {
    const getQR = async () => {
      setFetchQR(true);
      await orderService
        .getQR({ orderData: preSendData, amount: orderTotal })
        .then((res) => {
          setOmiseNet(res.data.net / 100);
          setChrgId(res.data.chrgId);
          setBase64(res.data.base64);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (orderTotal && !finishState && !fetchQR) {
      void trackPromise(getQR());
    }

    return () => {
      setFetchQR(false);
    };
  }, [fetchQR, finishState, orderTotal, preSendData]);

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
                    resetStorage();
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
    finishState,
    isQR,
    omiseNet,
    preSendData,
    resetStorage,
    setIsQR,
    setPreSendData,
    setShowModal,
  ]);

  return (
    <Center>
      <Modal
        avoidKeyboard
        isOpen={showModal && !(finishState && showReceipt)}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Modal.Content minW={"100%"} minH={"100%"} alignItems="center">
          <Modal.CloseButton />
          <Modal.Header
            mx="4"
            borderBottomWidth={1}
            alignItems="center"
            w="40%"
          >
            <Text fontWeight={600} fontSize="md">
              Thai QR
            </Text>
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
                  value={orderTotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={2}
                  fixedDecimalScale
                  renderText={(formattedValue) => (
                    <Text
                      fontWeight={600}
                      fontSize="md"
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
          orderId={orderId}
          setOrderId={setOrderId}
          setShowModal={setShowModal}
        />
      )}
    </Center>
  );
};

export default QRPayment;

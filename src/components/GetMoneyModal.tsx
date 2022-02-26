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
  ScrollView,
  Spinner,
} from "native-base";
import VirtualKeyboard from "react-native-virtual-keyboard";
import NumberFormat from "react-number-format";
import moment from "moment";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

const GetMoneyModal = ({
  showModal,
  setShowModal,
  total,
  ...props
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  total: any;
  props?: any;
}) => {
  const { promiseInProgress } = usePromiseTracker();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
  const [money, setMoney] = useState("0");
  const [tip, setTip] = useState("0");
  const [paidBack, setPaidBack] = useState("0");
  const [showReceipt, setShowReceipt] = useState(false);
  const checkInput = (e: React.SetStateAction<number>) => {
    const data = e.toString();
    const thoudsandSeperator = parseFloat(data).toFixed(2);
    setMoney(thoudsandSeperator);
  };
  const isEnough = (needed: number, paid: number) => {
    if (paid - needed >= 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const remain = parseFloat(money) - total - parseFloat(tip);
    setPaidBack(parseFloat(remain.toString()).toFixed(2));
    return () => {};
  }, [money, tip, total]);
  return (
    <Center>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsConfirm={setIsConfirm}
      />
      <NotEnoughAlert isAlertOpen={isAlertOpen} setAlertOpen={setAlertOpen} />
      <Modal
        avoidKeyboard
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsConfirm(false);
          setMoney("0");
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
                    value={money}
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={2}
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
                      if (isEnough(total, parseFloat(money))) setIsOpen(true);
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
                      เลขที่ออเดอร์: 21312
                    </Text>
                  </HStack>
                  <VStack mt={4} mb={8} space={4} px={4}>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1">
                        ได้รับเงิน
                      </Text>
                      <NumberFormat
                        value={money}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
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
                        onChangeText={(e) => setTip(e)}
                        rightElement={<Text fontSize="lg">บาท</Text>}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1">
                        เงินทอน
                      </Text>
                      <NumberFormat
                        value={paidBack}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
                        renderText={(formattedValue) => (
                          <Text fontSize="lg" textAlign="right" flex="1">
                            {formattedValue} บาท
                          </Text>
                        )}
                      />
                    </HStack>
                    <Button
                      size="lg"
                      colorScheme="altred"
                      variant="subtle"
                      onPress={() => {
                        setShowReceipt(true);
                        void trackPromise(
                          new Promise((resolve, _reject) => {
                            setTimeout(() => {
                              resolve(
                                fetch("url", {
                                  method: "GET",
                                }).then((response) => response.json())
                              );
                            }, 1000);
                          })
                        );
                      }}
                    >
                      พิมพ์ใบเสร็จ
                    </Button>
                    <Button size="lg" colorScheme="emerald">
                      เสร็จสิ้น
                    </Button>
                  </VStack>
                </VStack>
              </>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
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
                        เซ็นทรัลปิ่นเกล้า
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignSelf="center" mx="2">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        222 ถนนบรมราชชนนี แขวง อรุณอมรินทร์ เขตบางกอกน้อย
                        กรุงเทพมหานคร 10700
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        เบอร์โทรศัพท์: 02-222-2222
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
                    {Array(8)
                      .fill("")
                      .map((item, index) => (
                        <VStack key={index} justifyContent="center">
                          <HStack px="8">
                            <VStack flex="1">
                              <Text fontSize="lg" flex="1">
                                ไอติมเบนยา
                              </Text>
                            </VStack>
                            <VStack flex="1">
                              <NumberFormat
                                value={1600}
                                displayType={"text"}
                                thousandSeparator={true}
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
                            </VStack>
                          </HStack>
                          <HStack>
                            <VStack px={10}>
                              <Text fontWeight="light" fontSize="lg" flex="1">
                                8 x 200.00 บาท
                              </Text>
                            </VStack>
                          </HStack>
                        </VStack>
                      ))}
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
                        value={1222.12}
                        displayType={"text"}
                        thousandSeparator={true}
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
                        ภาษี (7%) :
                      </Text>
                      <NumberFormat
                        value={12.12}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
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
                        ราคาสุทธิิ :
                      </Text>
                      <NumberFormat
                        value={1333.12}
                        displayType={"text"}
                        thousandSeparator={true}
                        decimalScale={2}
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
                        value={1333.12}
                        displayType={"text"}
                        thousandSeparator={true}
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
                        value={1333.12}
                        displayType={"text"}
                        thousandSeparator={true}
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
                        เลขที่ใบเสร็จ {12312}
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center" mb="8">
                      <Text fontSize="lg" flex="1" textAlign="center">
                        {moment(1231231232222)
                          .local()
                          .format("DD/MM/YYYY HH:mm:ss")}
                      </Text>
                    </HStack>
                  </Box>
                </ScrollView>
              </Modal.Body>
              <Modal.Footer bg="transparent">
                <Button flex="1" colorScheme="emerald" onPress={() => {}}>
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
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  setIsConfirm: (any: boolean) => void;
}) => {
  const onClose = () => {
    setIsOpen(false);
  };
  const onConfirm = () => {
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

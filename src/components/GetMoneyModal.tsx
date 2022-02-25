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
} from "native-base";
import VirtualKeyboard from "react-native-virtual-keyboard";
import DisplayKeyboard from "react-native-display-keyboard";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);
  const [money, setMoney] = useState(0);
  const [tip, setTip] = useState(0);
  const [paidBack, setPaidBack] = useState(0);
  const checkInput = (e: React.SetStateAction<number>) => {
    const data = e.toString();
    const onlyDigits = parseFloat(data).toFixed(2);
    const thoudsandSeperator = parseFloat(onlyDigits).toLocaleString("en-US");
    setMoney(Number(thoudsandSeperator));
  };
  const isEnough = (needed: number, paid: number) => {
    if (paid - needed >= 0) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const remain = money - total - tip;
    setPaidBack(remain);
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
          setIsConfirm(false);
          setShowModal(false);
        }}
        size="lg"
      >
        <Modal.Content maxWidth="500">
          {!isConfirm && <Modal.CloseButton />}
          <Modal.Header mx="4" borderBottomWidth={1} alignItems="center">
            <Text fontSize="lg">{!isConfirm ? "เงินสด" : "ใบเสร็จ"}</Text>
          </Modal.Header>
          <Modal.Body _scrollview={{ scrollEnabled: false }} mt="2">
            {!isConfirm ? (
              <>
                <Box justifyContent="center" w="full" h="20" px="8">
                  <Text fontSize={16} color="gray.500">
                    กรอกจำนวนเงินที่ได้รับ
                  </Text>
                  <Text fontSize={32} textAlign="right">
                    {money || 0}
                  </Text>
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
                      if (isEnough(total, money)) setIsOpen(true);
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
                      <Text fontSize="lg" textAlign="right" flex="1">
                        {parseFloat(money.toString()).toFixed(2)} บาท
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1">
                        ราคาสุทธิ
                      </Text>
                      <Text fontSize="lg" textAlign="right" flex="1">
                        {parseFloat(total).toFixed(2)} บาท
                      </Text>
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1">
                        ทิป
                      </Text>
                      <Input
                        flex="1"
                        textAlign="right"
                        fontSize="lg"
                        value="0.00"
                        rightElement={<Text fontSize="lg">บาท</Text>}
                      />
                    </HStack>
                    <HStack justifyContent="center" alignItems="center">
                      <Text fontSize="lg" flex="1">
                        เงินทอน
                      </Text>
                      <Text fontSize="lg" textAlign="right" flex="1">
                        {paidBack} บาท
                      </Text>
                    </HStack>
                    <Button size="lg" colorScheme="altred">
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
